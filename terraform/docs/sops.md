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
  --parameters '{"host":[ '"\"$DATABASE_ADDRESS\""' ],"portNumber":["5432"],"localPortNumber":["5432"]}' >&2 &
SSM_PID=$!
for i in $(seq 1 15); do (echo > /dev/tcp/localhost/5432) >/dev/null 2>&1 && break; sleep 1; done
export DATABASE_URL=postgres://dailp:$DATABASE_PASSWORD@localhost:5432/dailp
# ... run psql / pg_dump_backup.sh / pg_export_to_csv.sh ...
# Group kill, not `kill $SSM_PID`: see the fourth point below.
kill -- "-$SSM_PID" 2>/dev/null || kill "$SSM_PID"
```

Four things matter here and each has broken a workflow before:

1. The trailing `&` -- the command blocks otherwise.
2. The readiness loop -- the tunnel is not up when `start-session` returns.
3. The bare hostname in `host` -- the RDS `endpoint` value includes `:5432` and will not work, so
   use `database_address`.
4. `>&2` on the tunnel, and killing the **process group** rather than the pid. `start-session` runs
   `session-manager-plugin` as a child that inherits its stdio, and `kill $SSM_PID` reaches only the
   `aws` wrapper -- leaving the plugin orphaned, still holding the local port and a live SSM session.
   Combined, those two are worse than untidy: a plugin that inherits your stdout and then outlives
   you holds the write end of any `$( ... )` you are inside, so the command substitution never sees
   EOF. That is what hung the Data Backup workflow for a full 60 minutes; see the
   [runbook](./runbook.md). Note the group kill needs job control, which interactive shells have on
   by default -- inside a script, add `set -m` immediately before the `&` and `set +m` after, as
   `bastionTunnel` in [`flake.nix`](../../flake.nix) does.

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

Both apps check that the local port is free before opening the tunnel, and fail with a message
naming the port rather than quietly reusing whatever session already owns it. They also kill the
tunnel's whole process group on exit, so an interrupted run should not leave a
`session-manager-plugin` behind for the next one to trip over.

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
changing an instance's key name, so the attribute forces instance replacement -- and the replacement
**succeeds**, destroying the running bastion. `disable_api_termination = true` does not prevent this:
the AWS provider clears termination protection before terminating and only warns if that fails (the
provider binary carries the string `attempting to terminate EC2 Instance (%s) despite error disabling
API termination`). Treat that attribute as documentation of intent, not as a guardrail -- it stops a
console misclick, not Terraform. `key_name` is also a single value shared by all three stages and the
deploy workflow applies with `-auto-approve`, so editing it breaks deploys for every stage at once.
Leave it recording whatever key the instance launched with.

The same reasoning applies to `ami`, which also forces replacement. See
[Replacing the bastion AMI](#replacing-the-bastion-ami) below -- do not simply edit the pin.

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

## Replacing the bastion AMI

`bastion-host.nix` pins the AMI to a literal id per stage, on purpose -- the file explains why at
length. Refreshing that pin, or moving between OS major versions, is an **instance replacement**.
There is no in-place OS upgrade for Amazon Linux, and nothing here restores what the old instance
carried.

**Do not do it by editing the pin and letting Terraform replace the instance.** Under
`-auto-approve` the destroy is unattended and unabortable, and if the create then fails -- wrong
subnet, no capacity, a root volume smaller than the AMI's snapshot -- the stage is left with no
bastion at all. In `main.yml` the step immediately after the apply tunnels through the bastion to
migrate the schema, so that failure takes the release with it. Rolling back is not reliable either:
the old image may already be deregistered, which is exactly what end-of-life does to an AMI id.

Do it blue/green instead. The repo is already built for this -- [`import.nix`](../import.nix)
exists to adopt an instance created outside Terraform, and there is nothing else to repoint: no EIP
(`bastion_ip` is permanently empty), no Route53 record, no load balancer. Access is entirely "which
instance id does SSM target", i.e. one GitHub secret.

### Where each step runs

| Step | Runs | Why there |
|---|---|---|
| 1 Record ground truth | **Local** | Read-only AWS CLI. |
| 2 Set + verify the subnet secret | **GitHub UI**, then **CI** | Only the PR check proves it: a local plan uses *your* environment, not the repository's secrets, so a clean local plan says nothing about what `tf-apply-now` will do. |
| 3 Resolve the new image | **Local** | Read-only. |
| 4 Launch the new instance | **Local** | Deliberately out of band. No workflow does this and none should. |
| 5 Validate + seed keys | **Local** | Unavoidable: every workflow targets whatever `*_EC2_INSTANCE` holds, which is still the *old* instance until 6a. Local is the only place you can point `BASTION_ID` at the new one. `BASTION_SSH_KEY` is also only on your machine. |
| **6a** Flip the secret | **GitHub UI** | -- |
| **6b** `state rm` + plan + apply | **Local, interactive** | `terraform state rm` has no CI path at all, and CI's only apply is `tf-apply-now` (`-auto-approve`) -- precisely what must not be used, because the whole point is a human reading the plan and aborting on `must be replaced`. |
| **6c** Merge | **CI** | `main.yml` applies from `main`. Expect a bastion **no-op**; that no-op is the confirmation the loop is closed. |
| 7 Soak + terminate | **Local** | -- |
| End-to-end validation | **CI** | `infra-check.yml` and the Data Backup workflow. These only make sense *after* 6a, and CI is what actually has to work. |

The rule underneath: **CI confirms the change, it never makes it.** Green is created, validated and
adopted from a workstation; CI's job is to agree afterwards.

### Two traps in the local Terraform steps

**Never run an untargeted `terraform apply` from a workstation.** This is the most dangerous thing
in this document. `tf-plan`/`tf-apply` both run `tfInit`, which regenerates `config.tf.json` from
the *evaluating* environment, and several variables the config reads via `getEnv` exist **only as
GitHub secrets** -- they are not in `.env`, so they are empty in every local shell:
`AWS_VPC_ID`, `AWS_SUBNET_PRIMARY`, `AWS_SUBNET_SECONDARY0`, `AWS_SUBNET_SECONDARY1`,
`AWS_ZONE_PRIMARY`, `AWS_ZONE_SECONDARY0`, `AWS_ZONE_SECONDARY1`, `AWS_SUBNET_BASTION`,
`AWS_SSH_KEY`.

Empty is not inert. A local plan with the subnet variables unset proposes:

```
# aws_db_subnet_group.sql_database will be updated in-place
  ~ subnet_ids = [
      - "subnet-05944b39f6c30b57e",
      - "subnet-05a9ef63c46e7e7bc",
      - "subnet-0c5c9bca12e771cab",
      + "",
    ]
```

i.e. it swaps the database's three real subnets for a single empty string. `terraform/main.nix`
warns for each of these when unset -- those warnings are the signal that your generated config does
not describe reality, and you must not apply through them.

So do both of the following:

1. **Export what you have.** At minimum `AWS_VPC_ID` and `AWS_SUBNET_BASTION`; ideally all of the
   above, read off the live resources or the repository secrets.
2. **Always `-target`.** Restrict the apply to the resource you actually mean to change. The
   `.#tf-apply` app takes no arguments, so use `tf-init` to generate the config and then drive
   `terraform` directly (see step 6b).

Reviewing the plan is not sufficient protection on its own here, because the damage is in a resource
you are not thinking about. `-target` is what makes a local apply safe.

Note the values that *are* in `.env` -- `OAUTH_TOKEN`, `GIT_REPOSITORY_URL`, `DATABASE_PASSWORD`,
`GOOGLE_API_KEY`, `TURNSTILE_*`, `TF_STAGE` -- reach you only inside `nix develop`, since `nix run`
does not source it. Without them `aws_amplify_app.dailp` fails validation outright
(`expected length of oauth_token to be in the range (1 - 1000), got`), which is at least a loud
failure rather than a silent one.

**`AWS_PROFILE` must name a profile that actually exists, or nothing works.** This is the single
most likely way these steps fail, and the error does not look like what it is. Terraform's S3
backend resolves `AWS_PROFILE` against `~/.aws/config` **before and independently of** credentials,
and aborts if the profile is absent:

```
Error: failed to get shared config profile, <name>
Error loading the state: failed to get shared config profile, <name>
```

That happens even with perfectly valid credentials exported — it is config resolution, not
authentication. The usual cause is pasting the AWS access-portal label
(`PermissionSet-AccountId`, e.g. `NEU-SystemAdministrator-783177801354`) which is *not* a profile
name. For this account the profile is `library-dev`. None of the `tf-*` apps accept `--profile`, so
this is all environment:

```sh
aws configure list-profiles          # the names that actually exist. Start here.

unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
export AWS_PROFILE=library-dev
aws sts get-caller-identity || aws sso login      # refresh the SSO token if this fails
```

That alone is sufficient — `terraform` reads the profile and resolves SSO itself. If you would
rather not depend on shared config at all (useful when something else in your shell keeps setting
`AWS_PROFILE`), materialise the credentials and drop the profile reference:

```sh
eval "$(aws configure export-credentials --format env)"
unset AWS_PROFILE                    # now there is no shared-config lookup left to fail
aws sts get-caller-identity          # must still succeed
```

Both paths are verified working. Note `nix run` does **not** source `.env` — only `nix develop`
does, via the shellHook's `direnv dotenv` — so for the `nix run .#tf-*` commands here it is your
ambient environment that counts, not the repo's `.env`.

Note also that `tf-output` alone does *not* run `tfInit`, so it needs `TF_DATA_DIR` already set and
a prior `tf-init` -- which is why the workflows always call `tf-init` before it.

**1. Record what the new instance must match.** An import diff that proposes replacement means one
of these is wrong, so capture them all first:

```sh
aws ec2 describe-instances --instance-ids "$BASTION_ID" --query \
 'Reservations[].Instances[].{Subnet:SubnetId,Vpc:VpcId,Ami:ImageId,SGs:SecurityGroups[].GroupId,
   Profile:IamInstanceProfile.Arn,Key:KeyName,Mon:Monitoring.State,Meta:MetadataOptions,
   Vol:BlockDeviceMappings[].Ebs.VolumeId}'
aws ec2 describe-volumes --volume-ids <root-vol> \
  --query 'Volumes[].{Size:Size,Type:VolumeType,Enc:Encrypted}'
nix run --impure -L .#run-on-bastion -- 'cat ~/.ssh/authorized_keys' > ~/bastion-keys.bak
```

`root_block_device_encrypted` defaults to `true` in the module and `encrypted` is ForceNew, so the
new instance **must** launch with an encrypted root volume. Same for `monitoring` (default `true`)
and the `metadata_options` block.

**2. Confirm `AWS_SUBNET_BASTION` is set and correct.** It must equal the `SubnetId` above. If it is
empty, `terraform` declares the bastion with no subnet, and a create would land it in the default
VPC where the security groups from the real VPC fail with `InvalidParameterCombination`.
`terraform/main.nix` emits a warning in the plan log when it is unset -- do not ignore it.

**3. Resolve the new image and check it against the declared root volume.**

```sh
AMI=$(aws ssm get-parameter --region us-east-1 \
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \
  --query Parameter.Value --output text)
aws ec2 describe-images --image-ids "$AMI" --query \
 'Images[].{Name:Name,Arch:Architecture,Root:RootDeviceName,Size:BlockDeviceMappings[].Ebs.VolumeSize}'
```

`Architecture` must be `arm64` (the instance type is `t4g.micro`), and the snapshot size must not
exceed `root_block_device_volume_size`. Use the standard AMI, not `al2023-ami-minimal-*` -- the
minimal image omits the AWS CLI that `upload_to_s3.sh` runs on the bastion.

**4. Launch the new instance out of band**, mirroring the module's rendered `aws_instance.default`:
that AMI, `t4g.micro`, the recorded subnet, both security groups,
`--iam-instance-profile Name=dailp-<stage>-bastion` (one profile can serve many instances),
`--key-name dailp-dev-2024`, `--monitoring Enabled=true`,
`--metadata-options HttpEndpoint=enabled,HttpTokens=required,HttpPutResponseHopLimit=1`,
`--block-device-mappings 'DeviceName=/dev/xvda,Ebs={VolumeSize=30,Encrypted=true,DeleteOnTermination=true}'`,
and `--user-data` rendered from
`.terraform/modules/bastion_host/user_data/amazon-linux.sh` with `ssh_user=ec2-user`,
`ssm_enabled=true` and an empty `user_data`. Launch *without* termination protection; the import
apply sets it in place. Use a `Name` tag of `dailp-<stage>-bastion-al2023` while validating -- the
discovery recipe in this document filters on `dailp-<stage>-bastion`, and two matches will mislead
the next person.

**5. Validate the new instance while the old one still serves everything.** SSM registration is the
part most worth proving early: there are no SSM VPC endpoints in this Terraform, so the agent's
reachability depends on a NAT path nothing here asserts, and an instance that never registers is
unreachable by any means.

```sh
export BASTION_ID=<new>
aws ssm describe-instance-information --filters "Key=InstanceIds,Values=$BASTION_ID" \
  --query 'InstanceInformationList[].{Ping:PingStatus,Agent:AgentVersion}'   # must be Online
nix run --impure -L .#run-on-bastion -- 'whoami; . /etc/os-release; echo $PRETTY_NAME; \
  bash --version | head -1; uname -m; df -h /; command -v aws && aws --version'
```

**Seed `authorized_keys`.** The new instance trusts exactly one key -- the public half of
`key_name`, injected by cloud-init. Everything the old instance had accumulated is gone, including
whatever key CI holds in `*_BASTION_SSH_KEY`; without that, the Data Backup workflow fails at
`Copy backup scripts to bastion` with `Permission denied (publickey)`.

**Append, do not overwrite.** Copying a file over `authorized_keys` wholesale would drop the launch
key you are currently authenticating with if the backup does not contain it, locking you out
mid-procedure. Filter the backup locally, ship it to a scratch path, and merge line by line:

```sh
export BASTION_ID=<new-instance-id>
export BASTION_SSH_KEY=~/.ssh/<the dailp-dev-2024 private key>

grep -Ev '^[[:space:]]*(#|$)' ~/bastion-keys.bak > /tmp/keys-to-add
nix run --impure -L .#copy-to-bastion -- /tmp/keys-to-add /home/ec2-user/incoming-keys
nix run --impure -L .#run-on-bastion -- '
  set -euo pipefail
  install -d -m 700 ~/.ssh
  touch ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  while IFS= read -r line; do
    grep -qxF "$line" ~/.ssh/authorized_keys || printf "%s\n" "$line" >> ~/.ssh/authorized_keys
  done < ~/incoming-keys
  rm -f ~/incoming-keys
  ssh-keygen -lf ~/.ssh/authorized_keys
'
```

`grep -qxF` needs the whole-line literal match because key material contains regex metacharacters.
The loop is idempotent, so re-running it is safe.

Then confirm the CI key specifically, by fingerprint rather than by assuming the backup carried it:

```sh
ssh-keygen -y -f ~/.ssh/<ci-key> | ssh-keygen -lf /dev/stdin   # expect this in the list above
BASTION_SSH_KEY=~/.ssh/<ci-key> nix run --impure -L .#run-on-bastion -- 'whoami'
```

Test `copy-to-bastion` separately from `run-on-bastion` -- `scp` and `ssh` fail in different ways.

If no key works at all, use the keyless path: `aws ssm start-session --target "$BASTION_ID"` drops
you on the box as `ssm-user` with `sudo`, so you can append to
`/home/ec2-user/.ssh/authorized_keys` by hand. Remember `chown ec2-user:ec2-user` and `chmod 600`
afterwards if you create the file that way.

**6. Cut over.** Keep these back-to-back and announce a freeze on pushes to `main` first: in the
window where the secret points at the new instance but `main` still holds the old pin, any push
would plan to replace it under `-auto-approve`. (Only dev is exposed to this -- `main.yml` reaches
uat and prod solely on release events. `concurrency` does not help; pushes and releases are
different refs.)

**6a. GitHub UI.** Flip the stage's secret -- `DEV_EC2_INSTANCE` / `UAT_EC2_INSTANCE` /
`EC2_INSTANCE` -- to the new instance id.

**6b. Local, interactive**, from the branch carrying the new pin. Not CI: `state rm` has no CI path,
and the only apply CI has is auto-approved.

Run it from inside `nix develop`, so `.env` supplies `OAUTH_TOKEN`, `GIT_REPOSITORY_URL` and the
rest; `nix run` on its own does not, and the Amplify resource then fails validation.

```sh
# In nix develop. Export the variables that are NOT in .env (see traps above).
export TF_STAGE=<stage> AWS_VPC_ID=vpc-... AWS_SUBNET_BASTION=subnet-...
export BASTION_ID=<new>

set -a; . ./.env; set +a                      # OAUTH_TOKEN etc. -- do not rely on direnv having run
nix run --impure -L .#tf-init                 # THE ONLY thing that regenerates config.tf.json
export TF_DATA_DIR=$(pwd)/.terraform          # tf-init sets this only inside its own shell

# Assert the generated config is not stale. Bare `terraform` never rewrites
# config.tf.json -- only the nix apps do (`cp -f $terraformConfig ./...`) -- so a
# tf-init that ran in an environment missing a variable leaves an empty value on
# disk that every later `terraform plan` faithfully re-reads.
grep -q '"oauth_token": ""' config.tf.json &&
  { echo "config.tf.json is stale/empty -- re-run tf-init with .env loaded"; false; }

BASTION=module.bastion_host.aws_instance.default[0]
terraform state rm "$BASTION"                 # old instance untouched in AWS

# -target, NOT a bare plan/apply: the generated config carries empty values for
# variables that only exist as GitHub secrets, and an untargeted apply would act
# on them. Do not use .#tf-plan / .#tf-apply here -- they take no arguments.
terraform plan  -target="$BASTION"            # expect: 1 to import, 0 to add/change/destroy
terraform apply -target="$BASTION"            # interactive. NEVER tf-apply-now
```

`-target` also keeps the plan short enough to actually read, which is the point of doing this step
by hand.

**In fish.** `nix develop` gives you bash whatever your login shell is, so the simplest thing is to
run the block above there, unmodified. If you would rather stay in fish
(`nix develop --command fish`), four lines need translating: `export X=y` becomes `set -gx X y`;
`set -a; . ./.env; set +a` becomes `direnv dotenv fish ./.env | source` (the same parser the
devShell's bash `shellHook` uses, just emitting fish -- and you do need it, because that hook cannot
export into a fish child); `$(pwd)` becomes `(pwd)`; and the `&& { ...; false; }` staleness assert
becomes a bare `grep` whose output you read yourself, since fish has no `{ ...; }` grouping. The rest
carries over as-is: `.#tf-init` is safe unquoted (`#` only opens a comment at a word boundary), and
`module.bastion_host.aws_instance.default[0]` is not read as a list index (brackets only index
directly after a `$var`).

**6c. CI.** Merge. `main.yml` applies from `main`; expect a bastion no-op, and treat that no-op as
the confirmation that the config, the state and the secret now agree.

The plan may show `disable_api_termination` going true, and possibly a `user_data` in-place update
(which stops and starts the instance). **Any `must be replaced` line is a stop-and-fix, not
something to approve** -- and backing out costs nothing at this point, because the old instance is
still running: `terraform state rm` the new one, re-import the old one, restore the secret.

Note that uat's state lives in the **dev** bucket under key `uat-terraform.tfstate`; confirm
`tf-init` selected the backend you expect before any `state rm`.

**7. Soak, then retire the old instance.** Keep it alive but unmanaged for at least one full backup
cycle. It still has termination protection and Terraform no longer knows about it, so:

```sh
aws ec2 modify-instance-attribute --instance-id <old> --no-disable-api-termination
aws ec2 terminate-instances --instance-ids <old>
```

Finally, `ssh-keygen -R '[localhost]:2222'` on operator machines -- the new host key otherwise
produces a mismatch warning that reads like an attack.

## Verifying Success

- `describe-instance-information` reports `PingStatus: Online`.
- `run-on-bastion -- 'whoami'` prints `ec2-user`.
- `copy-to-bastion` is worth testing separately from `run-on-bastion` -- `scp` and `ssh` fail in
  different ways, so one working does not prove the other does.
- After a key change, `ssh-keygen -lf ~/.ssh/authorized_keys` on the bastion lists exactly the
  fingerprints you expect. Anything unaccounted for is a finding, not noise.

## Known Limitations

- `authorized_keys` is unmanaged mutable state. It survives reboots, but any instance replacement or
  AMI rebuild loses every key added this way -- including whatever key CI uses, so re-seeding it is
  a step in [Replacing the bastion AMI](#replacing-the-bastion-ami), not an afterthought.
- Local ports are fixed (`5432` for the database, `2222` default for SSH). Concurrent runs, or a
  local Postgres already on 5432, will collide. The flake apps now detect this before opening the
  tunnel and fail with the port named, so a collision is loud rather than a wrong-session
  connection -- but it is still a collision, and `BASTION_LOCAL_PORT` is the only way around it.
- Host key checking is disabled in the flake apps (`StrictHostKeyChecking=no`), which is unavoidable
  when the SSH target is `localhost:2222`. Authentication is one-directional as a result.
- The bastion's instance role is granted only `s3:GetEncryptionConfiguration` for S3 by its own
  policy -- that policy belongs to the cloudposse module and cannot be extended from out here. The
  one write it can do comes from the *bucket* side: `allow_bastion_backup_writes` in
  [`../media-storage.nix`](../media-storage.nix) grants it `s3:PutObject` and
  `s3:AbortMultipartUpload` on `db-backups/*` of the media bucket, which is sufficient because the
  role and the bucket are in the same account. Anything you run on the bastion that writes anywhere
  *else* in S3 will get `AccessDenied`, and the fix is another statement there rather than a change
  to the role. Note you probably cannot grant it on the role yourself even if you wanted to: the
  `NEU-SysAdmin-Additional-Deny-Permissions` boundary on the NEU SSO admin roles denies
  `iam:PutRolePolicy` and `iam:AttachRolePolicy` on everything outside an ecs/ecr allowlist. The
  `dailp-deployment` user that CI applies as carries no such boundary.
- The bastion root volume is declared as 30 GiB in `bastion-host.nix`, but an instance launched
  before that was set may still have an 8 GiB volume, and a volume grown in place still has a
  filesystem at the old size until `growpart` + `xfs_growfs` runs. `df -h /home` is the only
  trustworthy answer -- check it before copying large backup bundles rather than reading the
  Terraform.

## Reference

- [`runbook.md`](./runbook.md) -- symptoms and fixes when the above fails.
- [`../flake.nix`](../flake.nix) -- the `copy-to-bastion` / `run-on-bastion` app definitions.
- [`bastion-host.nix`](../bastion-host.nix) -- the instance definition, including the `key_name` warning above and the rationale for pinning the AMI by id.
- [`../scripts/SOPs.md`](../scripts/SOPs.md) -- the database backup procedures these connections exist to serve.
