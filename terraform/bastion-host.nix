{ lib, config, ... }:
let
  # The bastion AMI, per stage. arm64 is not optional: instance_type below is
  # t4g.micro (Graviton).
  #
  # Pinned to literal ids on purpose, resolved once by hand. This is *not* a
  # lookup, and should not become one. Three properties compound to make any
  # latest-pointer (a `data.aws_ssm_parameter` on the al2023 alias, or the
  # module's own `ami_filter`) actively dangerous here:
  #
  #   1. .github/workflows/main.yml deploys with `.#tf-apply-now`, i.e.
  #      `terraform apply -auto-approve` -- nobody reads the plan.
  #   2. The cloudposse module's aws_instance.default has no `lifecycle` block,
  #      so `ignore_changes = [ami]` is not expressible from out here at all.
  #   3. A new ami id forces instance replacement.
  #
  # AWS republishes AL2023 roughly every two weeks, so a latest-pointer would
  # turn each release into an unattended bastion replacement -- which also wipes
  # ~/.ssh/authorized_keys, unmanaged mutable state that nothing here restores.
  # PR #705 removed the pin (falling through to the module's `data.aws_ami` with
  # `most_recent = "true"`); it was reverted, and #708 put the literals back.
  #
  # Setting `ami` makes the module ignore `ami_filter` and `ami_owners`
  # entirely, so there is no point configuring them.
  #
  # Every stage is us-east-1 (see provider.aws.region in ./main.nix). Amazon's
  # *public* images carry the same id in every account in a region, so a public
  # pin is portable across the dev and prod accounts -- but note dev's current
  # pin is not one of those (see below), so don't assume portability without
  # checking `Public` and `OwnerId` in describe-images.
  #
  # To resolve a current Amazon Linux 2023 arm64 image. Use the *standard* AMI,
  # not al2023-ami-minimal-*, which omits the AWS CLI that ./scripts needs. Note
  # the namespace is ami-amazon-linux-latest; there is no ami-al2023-latest.
  #
  #   aws ssm get-parameter --region us-east-1 \
  #     --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \
  #     --query Parameter.Value --output text
  #
  # `kernel-default` moved from 6.1 to 6.18 on 2026-08-17, so it is not a stable
  # lineage; the version-specific al2023-ami-kernel-6.1-arm64 and
  # al2023-ami-kernel-6.12-arm64 parameters exist alongside it.
  #
  # AWS marks every AL2023 ami deprecated 90 days after release and eventually
  # deregisters it, so a pin left alone for a year may no longer launch.
  # Re-resolve when you touch this, and follow "Replacing the bastion AMI" in
  # ./docs/sops.md -- an ami change is an instance replacement, not an edit.
  # One stage per PR.
  amis = {
    # A *private* image owned by this account (783177801354):
    # "daily-dev-bastion-host", created 2025-04-30, arm64, 8 GiB gp2, described
    # as "bastion host for DAILP dev GHA deployments". It is Amazon Linux 2
    # derived -- SSM reports PlatformVersion 2 for the running instance -- so it
    # has bash 4.2 and cannot run ./scripts. Because it is hand-built rather
    # than an Amazon image, replacing it also loses whatever was baked into it
    # beyond the OS; validate a replacement against the Data Backup workflow
    # rather than assuming parity.
    #
    # TODO(al2023-migration): this stage still needs migrating. Candidates
    # resolved 2026-09-04, all release 2023.12.20260831.0, all arm64, all 8 GiB
    # gp3, all deprecating 2026-11-24:
    #   ami-0c2fab8ab93985c9b  kernel-6.1   <- matches prod's lineage
    #   ami-0319c21b79f9f8c13  kernel-6.12
    #   ami-07987a01dcdb011ef  kernel-6.18  (current "kernel-default")
    # Do not simply swap the id in: merging that replaces the live bastion on
    # the next auto-approved apply. Stand the new instance up first, per
    # ./docs/sops.md.
    dev = "ami-0c2fab8ab93985c9b";

    # amzn2-ami-kernel-5.10-hvm-2.0.20220316.0-arm64-gp2 -- Amazon Linux 2,
    # deprecated 2024-03-16, and AL2 reached end of support 2026-06-30.
    # TODO(al2023-migration): this stage still needs migrating.
    uat = "ami-03190fe20ef6b1419";

    # al2023-ami-2023.10.20260330.0-kernel-6.1-arm64 -- already Amazon Linux
    # 2023, so prod needs no OS migration. This particular image was deprecated
    # 2026-06-28, so refresh the pin when convenient (still a replacement).
    prod = "ami-037d882b31eae26a2";
  };
in {
  options.servers.bastion = with lib;
    with types; {
      instance_tags = mkOption { type = attrsOf str; };
    };

  config.module.bastion_host = {
    source =
      "github.com/cloudposse/terraform-aws-ec2-bastion-server?ref=v0.31.1";
    enabled = true;
    instance_type = "t4g.micro";

    # Dynamic attribute select rather than an if/else chain: setup.stage is an
    # enum (see ./bootstrap.nix), so a stage with no pinned ami is an eval
    # error instead of silently falling through to dev's image.
    ami = amis.${config.setup.stage};

    # Headroom, not a compatibility requirement. The module default is 8 GiB and
    # the AL2023 arm64 snapshots are also 8 GiB, so the "cannot be smaller than
    # the AMI it refers to" constraint in the module's own variable description
    # is not binding here -- 8 would still launch. The reason to raise it is
    # operational: ./docs/runbook.md records disk pressure on this volume as a
    # recurring cause of failed backups, because a run stages a pg_dump plus a
    # CSV export under /home before uploading.
    #
    # Not ForceNew: changing this is an in-place ModifyVolume, so it does not
    # replace the instance. It does not grow the filesystem either -- that needs
    # growpart + xfs_growfs, or a reboot. EBS also enforces a cooldown of
    # several hours between modifications of the same volume.
    root_block_device_volume_size = 30;

    # ID will be constructed from these namespace, stage, and name for some reason.
    namespace = "dailp";
    stage = config.setup.stage;
    name = "bastion";

    key_name = "dailp-dev-2024";

    # Both false, and both stated explicitly. The module computes
    # `eip_enabled = associate_public_ip_address && assign_eip_address`, so this
    # has always been a no-op -- but the module *defaults*
    # assign_eip_address to true, so dropping the line would not say what we
    # mean. The bastion is reached over SSM; see the bastion_ip note below.
    assign_eip_address = false;
    associate_public_ip_address = false;
    vpc_id = config.setup.vpc;
    subnets = [
      config.setup.bastion_subnet
      # config.setup.subnets.primary
      # config.setup.subnets.secondary
      # config.setup.subnets.tertiary
    ];
    
    # Don't create a new security group for this server.
    security_group_enabled = false;
    # Use the existing one setup for database access.
    security_groups = [
      "\${aws_security_group.mongodb_access.id}"
      "\${aws_security_group.nixos_test.id}"
    ];
    disable_api_termination = true;

    tags = config.setup.global_tags // config.servers.bastion.instance_tags;
  };

  # Note: this is always empty. The module computes
  # `eip_enabled = associate_public_ip_address && assign_eip_address`, and we
  # set associate_public_ip_address = false above, so no EIP is created and
  # `public_ip` falls through to "". The bastion is reached over SSM, not by IP
  # -- see the copy-to-bastion / run-on-bastion apps in flake.nix.
  config.output.bastion_ip = { value = "\${module.bastion_host.public_ip}"; };

  # Referenced by flake.nix's bastion apps as
  # `nix run --impure .#tf-output bastion_id`. Only resolves after an apply,
  # and note import.nix reads BASTION_ID from the environment, so you need the
  # id before terraform can tell it to you -- this is for confirmation, not
  # discovery. To look it up cold:
  #   aws ec2 describe-instances \
  #     --filters Name=tag:Name,Values=dailp-<stage>-bastion \
  #     --query 'Reservations[].Instances[].InstanceId'
  config.output.bastion_id = { value = "\${module.bastion_host.instance_id}"; };
}
