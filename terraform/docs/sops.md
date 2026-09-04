# SOP: Bastion Host Access

How to reach a DAILP bastion host and, through it, a non-local database. Companion to
[`runbook.md`](./runbook.md) in this folder, which covers what to do when a step here fails.

Scoped to the infrastructure in this folder. For the database backup procedures that depend on
these connections, see [`../scripts/SOPs.md`](../scripts/SOPs.md).

## Purpose

The DAILP database is not reachable from the internet, and neither is the host that fronts it. Each
stage (dev/uat/prod) has one bastion EC2 instance which has **no public IP and no port-22 ingress
rule** -- so you cannot `ssh` to it directly, and adding a security-group rule will not help
(Terraform declares the relevant group with an empty `ingress` list and will delete any rule added
by hand).

All access instead goes through an **AWS SSM Session Manager** port-forwarding session, which the
SSM agent serves from inside the instance and which therefore never traverses a security group.
There are two distinct shapes of this, and it's worth knowing which you need:

- **Reaching the database** -- forward `localhost:5432` to the RDS endpoint *through* the bastion.
  Use this for `psql`, `pg_dump`, and the scripts in this folder.
- **Reaching the bastion itself** -- forward `localhost:2222` to the bastion's own port 22, then
  run real `ssh`/`scp` inside that tunnel. Use this to run a script *on* the bastion, e.g. an S3
  upload that has to originate inside the VPC. The `copy-to-bastion` and `run-on-bastion` flake
  apps do this for you.

## Prerequisites

- AWS credentials with `ssm:StartSession` (and `ec2:DescribeInstances` to look up the instance id).
- `session-manager-plugin` on `PATH`. The `nix develop` shell provides it; the AWS CLI shells out
  to it by name, so `aws ssm start-session` fails without it.
- `BASTION_ID` -- the bastion's EC2 instance id.
- `BASTION_SSH_KEY` -- path to a private key whose public half is in the bastion's
  `authorized_keys`. Needed only for `copy-to-bastion` / `run-on-bastion`, not for the database
  tunnel.
- Note that **none of the `BASTION_*` variables are in `.env`**, so the `nix develop` shell does not
  set them. Export them yourself.

## Procedure

**1. Find the instance id.** The `Name` tag is built from namespace/stage/name, so it is
`dailp-<stage>-bastion`:

```sh
export BASTION_ID=$(aws ec2 describe-instances \
  --filters Name=tag:Name,Values=dailp-dev-bastion Name=instance-state-name,Values=running \
  --query 'Reservations[].Instances[].InstanceId' --output text)
```

There is also a `bastion_id` Terraform output, but it only resolves after an apply, and the
Terraform config reads `BASTION_ID` from the environment in order to import the instance -- so it
confirms an id you already have rather than discovering one. `bastion_ip` exists too but is always
empty; ignore it.

**2. Confirm the SSM agent is online.** Do this before debugging anything else -- if the agent is
not registered, every command below fails in confusing ways:

```sh
aws ssm describe-instance-information --filters "Key=InstanceIds,Values=$BASTION_ID" \
  --query 'InstanceInformationList[].{Ping:PingStatus,Agent:AgentVersion}'
```

`PingStatus` must be `Online`.

**3a. To reach the database**, open the tunnel in the background and wait for it:

```sh
DATABASE_ADDRESS=$(nix run --impure .#tf-output database_address)
aws ssm start-session --target "$BASTION_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":[ '"\"$DATABASE_ADDRESS\""' ],"portNumber":["5432"],"localPortNumber":["5432"]}' &
SSM_PID=$!
for i in $(seq 1 15); do (echo > /dev/tcp/localhost/5432) >/dev/null 2>&1 && break; sleep 1; done
export DATABASE_URL=postgres://dailp:$DATABASE_PASSWORD@localhost:5432/dailp
# ... run psql / pg_dump_backup.sh / pg_export_to_csv.sh ...
kill $SSM_PID
```

Three things matter here and each has broken a workflow before: the trailing `&` (the command
blocks otherwise), the readiness loop (the tunnel is not up when `start-session` returns), and the
bare hostname in `host` (the RDS `endpoint` value includes `:5432` and will not work -- use
`database_address`).

**3b. To run something on the bastion**, use the flake apps, which handle the tunnel, the wait, and
the cleanup for you:

```sh
export BASTION_SSH_KEY=~/.ssh/<your-bastion-key>
nix run --impure -L .#run-on-bastion -- "whoami && hostname"
nix run --impure -L .#copy-to-bastion -- ./scripts /home/ec2-user/
```

`copy-to-bastion` takes `<local-path> [remote-path]` and defaults the remote path to the login
user's home. Two optional overrides: `BASTION_SSH_USER` (default `ec2-user`) and
`BASTION_LOCAL_PORT` (default `2222`, worth changing if that port is already bound).

## Rotating or Adding a Bastion SSH Key

**Which key is the launch key.** `key_name` is `dailp-dev-2024` for all three stages. AWS created
that key pair (not imported), it is RSA, and `aws ec2 describe-key-pairs --key-names dailp-dev-2024`
reports fingerprint `40:9a:95:a3:81:af:d2:3d:96:70:10:71:1b:e5:6b:be:5f:55:37:39` -- the SHA-1 of
the PKCS#8 DER private key. Its OpenSSH fingerprint, as it appears in `authorized_keys`, is
`SHA256:lFTITtSkkdypihRgnrKn9Gvz1mUcjRzi75sbnWi4Gn4`. Recorded here because more than one private
key file has circulated under similar names; check any candidate against these before trusting it:

```sh
# AWS-side fingerprint of a private key file, for comparison with describe-key-pairs
openssl pkcs8 -in <keyfile> -nocrypt -topk8 -outform DER | openssl sha1 -c
# OpenSSH fingerprint, for comparison with authorized_keys
openssl rsa -in <keyfile> -pubout | ssh-keygen -i -m PKCS8 -f /dev/stdin | ssh-keygen -lf /dev/stdin
```

Note that matching `key_name` does not by itself prove a key still works -- `authorized_keys` is
mutable and has been decoupled from `key_name` since the instances launched. `ssh-keygen -lf` on the
bastion's own `authorized_keys` is the only authoritative list of what it currently trusts.

**Do not change `key_name` in `bastion-host.nix` to rotate a key.** EC2 has no API for
changing an instance's key name, so the attribute forces instance replacement -- and because the
bastion is `terraform import`ed with `disable_api_termination = true`, that replacement destroys
first and then fails, aborting the apply. `key_name` is also a single value shared by all three
stages and the deploy workflow applies with `-auto-approve`, so editing it breaks deploys for every
stage at once. Leave it recording whatever key the instance launched with.

Rotate by editing `authorized_keys` on the running instance instead. This is drift-free: Terraform
never manages that file, so `terraform plan` stays clean regardless of which key you use.

```sh
# 1. Generate. ed25519, no passphrase (CI cannot answer a prompt), outside the repo tree.
ssh-keygen -t ed25519 -C "dailp-<stage>-bastion-<YYYYMM>" \
  -f ~/.ssh/dailp-<stage>-bastion-<YYYYMM> -N ''
chmod 600 ~/.ssh/dailp-<stage>-bastion-<YYYYMM>

# 2. Append it, authenticating with a key that already works. Idempotent -- `grep -qxF` needs the
#    whole-line, literal match because key material contains regex metacharacters.
PUBKEY="$(cat ~/.ssh/dailp-<stage>-bastion-<YYYYMM>.pub)"
BASTION_SSH_KEY=~/.ssh/<existing-key> \
nix run --impure -L .#run-on-bastion -- "
  install -d -m 700 ~/.ssh
  touch ~/.ssh/authorized_keys
  grep -qxF '$PUBKEY' ~/.ssh/authorized_keys || printf '%s\n' '$PUBKEY' >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ssh-keygen -lf ~/.ssh/authorized_keys
"

# 3. Verify the new key independently, then remove the old line if you are retiring it.
BASTION_SSH_KEY=~/.ssh/dailp-<stage>-bastion-<YYYYMM> \
  nix run --impure -L .#run-on-bastion -- 'whoami'
```

If no existing key works, you can do the same edit without one: `aws ssm start-session --target
"$BASTION_ID"` drops you on the box as `ssm-user` with `sudo`, and you can append to
`/home/ec2-user/.ssh/authorized_keys` by hand. Remember to `chown ec2-user:ec2-user` and
`chmod 600` afterwards if you create the file that way.

Store the private half in exactly three places: the team password manager (with its
`ssh-keygen -lf` fingerprint and creation date), the relevant GitHub Actions **environment** secret
if CI needs it, and `~/.ssh/` on operator machines at mode `600`. Add and verify a new key before
removing an old one, and do prod last.

## Verifying Success

- `describe-instance-information` reports `PingStatus: Online`.
- `run-on-bastion -- 'whoami'` prints `ec2-user`.
- `copy-to-bastion` is worth testing separately from `run-on-bastion` -- `scp` and `ssh` fail in
  different ways, so one working does not prove the other does.
- After a key change, `ssh-keygen -lf ~/.ssh/authorized_keys` on the bastion lists exactly the
  fingerprints you expect. Anything unaccounted for is a finding, not noise.

## Known Limitations

- `authorized_keys` is unmanaged mutable state. It survives reboots, but any instance replacement or
  AMI rebuild loses every key added this way.
- Local ports are fixed (`5432` for the database, `2222` default for SSH). Concurrent runs, or a
  local Postgres already on 5432, will collide.
- Host key checking is disabled in the flake apps (`StrictHostKeyChecking=no`), which is unavoidable
  when the SSH target is `localhost:2222`. Authentication is one-directional as a result.
- The bastion's instance role is granted only `s3:GetEncryptionConfiguration` for S3 by Terraform.
  Anything you run on the bastion that writes to S3 depends on a managed policy attached outside
  Terraform; check with `aws iam list-attached-role-policies --role-name dailp-<stage>-bastion`
  before assuming it will work.
- The bastion root volume is 8 GiB and not overridden. Check `df -h /home` before copying large
  backup bundles.

## Reference

- [`runbook.md`](./runbook.md) -- symptoms and fixes when the above fails.
- [`../flake.nix`](../flake.nix) -- the `copy-to-bastion` / `run-on-bastion` app definitions.
- [`bastion-host.nix`](./bastion-host.nix) -- the instance definition, including the `key_name` warning above.
- [`../scripts/SOPs.md`](../scripts/SOPs.md) -- the database backup procedures these connections exist to serve.
