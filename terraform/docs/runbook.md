# Runbook: Bastion / SSM Access Errors

Companion to [`sop.md`](./sop.md) in this folder, which documents the bastion access procedure
itself. This runbook covers what to do when a step in that procedure fails.

Covers errors you may hit connecting to a bastion host, or to a non-local database through one. A
failure in this layer usually *looks* like a credential or key problem, so work down the table in
order rather than jumping to the row that matches your guess.

For errors in the database backup scripts themselves, see
[`../scripts/runbook.md`](../scripts/runbook.md).

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `run-on-bastion` or `copy-to-bastion` produces **no output at all** -- no tunnel message, and nothing on stdout | `BASTION_ID` or `BASTION_SSH_KEY` is unset. Both are validated with `${VAR:?...}` *before* the script prints anything, and that writes to **stderr**, leaving stdout completely empty. Neither is in `.env`, so `BASTION_ID` in particular does not survive opening a new terminal. | `echo "id=$BASTION_ID key=$BASTION_SSH_KEY"`; export whichever is empty and retry. Check stderr, where the real message is. |
| `SessionManagerPlugin is not found` | The AWS CLI shells out to `session-manager-plugin` by name and it isn't on `PATH`. | Run from a `nix develop` shell, which provides it. This is the single most common cause of every other symptom in this table. |
| `scp: Connection refused` or `ssh: connect to host localhost port 2222: Connection refused`, immediately after `Waiting for tunnel to come up...` | The SSM tunnel never opened, so nothing is listening locally. Almost always the missing plugin above -- *not* a bad key. | Check `command -v session-manager-plugin` first. The flake apps now fail with an explicit tunnel message instead of falling through to this, so if you see the bare `Connection refused` you may be on an older checkout. |
| `An error occurred (TargetNotConnected) when calling the StartSession operation` | The SSM agent on the instance is not registered or has lost its connection. Nothing can be delivered to the host in this state. | `aws ssm describe-instance-information --filters "Key=InstanceIds,Values=$BASTION_ID"` -- if the list is empty or `ConnectionLost`, this is an infrastructure problem, not a client one. There are no SSM VPC endpoints in the Terraform, so agent reachability depends on a NAT path that nothing in this repo asserts. Escalate. |
| `An error occurred (AccessDeniedException) ... ssm:StartSession` / `ssm:SendCommand` | Your IAM principal lacks the action. `StartSession` and `SendCommand` are separate permissions -- having one does not imply the other. | `aws sts get-caller-identity` to confirm which principal you're using. Only `StartSession` is needed for anything in [`sop.md`](./sop.md); `SendCommand` is not. |
| `An error occurred (403) when calling the StartSession operation: Server authentication failed: <UnauthorizedRequest><message>Forbidden.</message></UnauthorizedRequest>` | Note this is **not** the JSON `AccessDeniedException` shape an IAM denial produces, which makes it tempting to theorise about proxies and WAFs. In practice it was **stale credentials**: `.env` carries temporary `ASIA...` credentials plus `AWS_SESSION_TOKEN`, the dev shell sources them automatically, and they expire. Note also that static credential env vars take precedence over `AWS_PROFILE` in the SDK chain, so adding a profile does *not* override expired values still sitting in the environment. | `aws sts get-caller-identity` first -- always, before reasoning about the error text. To switch to an SSO profile you must clear the old values, not just set the new ones: `unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN`, then `export AWS_PROFILE=...` and `aws sso login`. For Terraform (`tf-output`, `tf-plan`) also run `eval "$(aws configure export-credentials --format env)"`, since it has no `--profile` flag. |
| `Permission denied (publickey)` | The tunnel is working (you reached sshd) but `BASTION_SSH_KEY` isn't in the bastion's `authorized_keys`, or `BASTION_SSH_USER` is wrong. | Re-run with `ssh -vvv` and read the `Offering public key` / `Authentications that can continue` lines. Confirm the login user is `ec2-user`. If no key you hold works, use the keyless `aws ssm start-session` path in [`sop.md`](./sop.md) to add one. |
| `WARNING: UNPROTECTED PRIVATE KEY FILE!` followed by `This private key will be ignored` | The key file's permissions are too open (e.g. `0644`, typical of a fresh browser download). Reads like a corrupt key, but isn't. | `chmod 600` the key file. Keep keys in `~/.ssh/`, not `~/Downloads`. |
| `Load key "...": error in libcrypto` or `invalid format` | The key content is mangled -- usually a lost trailing newline or lost line breaks from a copy-paste into a secret store. | Re-copy the file verbatim, including the `-----BEGIN`/`-----END` lines. When storing in a secrets manager, verify the consumer re-adds a trailing newline; if it can't, store the key base64-encoded and decode on use. |
| `bind: Address already in use`, or the tunnel appears up but connects to the wrong thing | Local port already bound -- a leftover `session-manager-plugin` from an interrupted run, or a local Postgres on 5432. | `lsof -i :2222` / `lsof -i :5432` and kill the stale process. For SSH, override with `BASTION_LOCAL_PORT`. |
| `Starting session with SessionId: ...` succeeds, then `Cannot perform start session: listen unix /var/folders/.../nix-shell.XXXXXX/<digits>_session_manager_plugin_mux.sock: bind: invalid argument` | **macOS only, and only for port forwarding.** The plugin binds a Unix-domain multiplexer socket at `$TMPDIR/<digits>_session_manager_plugin_mux.sock` (42-char basename). Darwin caps `sockaddr_un.sun_path` at 104 bytes, 103 usable; `nix develop` sets `TMPDIR` to a ~65-char `/var/folders/.../nix-shell.XXXXXX` path, giving 108, and `bind()` returns `EINVAL`. macOS's bare `TMPDIR` (~48 chars) is short enough, so this appears only inside the dev shell. Note the session itself started -- credentials and permissions are fine. | The flake apps handle this themselves. If you're invoking `aws ssm start-session` directly, prefix it with `TMPDIR=/tmp`. Do **not** chase this as a credentials or IAM problem; a plain `aws ssm start-session` with no `--document-name` will still work, because plain sessions never bind this socket. |
| `psql: could not connect to server` after the tunnel reported ready | The readiness loop broke out on a socket that closed immediately, or `DATABASE_PASSWORD` isn't set. | Confirm `DATABASE_PASSWORD` is exported, then re-run `psql "$DATABASE_URL" -c 'select 1;'` to separate auth from connectivity. See also the `pg_dump failed.` row in [`../scripts/runbook.md`](../scripts/runbook.md). |
| `An error occurred (InvalidInstanceId)` | `BASTION_ID` is empty or points at another stage's instance. | Job-level environment config cannot always resolve stage-conditional values; confirm `echo $BASTION_ID` is non-empty and matches the stage you intend. |
| `upload failed: ... An error occurred (AccessDenied)` from `upload_to_s3.sh` when run *on* the bastion | The bastion instance role is granted only `s3:GetEncryptionConfiguration` for S3 in Terraform. Write access, if any, comes from a managed policy attached outside Terraform. | `aws iam list-attached-role-policies --role-name dailp-<stage>-bastion` and `aws iam list-role-policies --role-name dailp-<stage>-bastion`. If nothing grants write, this needs an infrastructure change -- escalate. A working SSH key does not imply a working upload. |
| `No space left on device` while copying a backup bundle to the bastion | The bastion root volume is 8 GiB and is not overridden in Terraform. | `run-on-bastion -- 'df -h /home'` before large copies; clean up prior bundles under `/home/ec2-user/backup`. |
| Transfer dies partway through a large `scp` | Tunnel idle timeout or a dropped session mid-transfer. | Retry; if it recurs, add `-o ServerAliveInterval=60 -o ServerAliveCountMax=10` to the `ssh`/`scp` invocation. |

## Nothing Above Matches

If you're seeing an error not listed here, capture the full command and its stderr and escalate to
the assistant program manager rather than continuing to retry. Two things are worth checking first,
because they cause most of the confusing cases:

```sh
aws sts get-caller-identity     # are you who you think you are, with unexpired credentials?
echo "$BASTION_ID"              # is the target actually set?
```

Reason from the error text only after those two are known good -- error shape is a much less
reliable signal than identity and configuration.
