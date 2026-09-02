{ lib, config, ... }: {
  options.servers.bastion = with lib;
    with types; {
      instance_tags = mkOption { type = attrsOf str; };
    };

  config.module.bastion_host = {
    source =
      "github.com/cloudposse/terraform-aws-ec2-bastion-server?ref=v0.31.1";
    enabled = true;
    instance_type = "t4g.micro";
    
    # TODO Make this more flexible
    ami = if config.setup.stage == "prod" 
      then "ami-037d882b31eae26a2" 
      else if config.setup.stage == "uat"
      then "ami-03190fe20ef6b1419"
      else "ami-0d1c8113ba7b8b12a";

    # ami_filter = {
    #   name = [ "amzn2-ami-*-hvm-*-arm64-gp2" ]
    # };


    # ID will be constructed from these namespace, stage, and name for some reason.
    namespace = "dailp";
    stage = config.setup.stage;
    name = "bastion";

    key_name = "dailp-dev-2024";

    assign_eip_address = true;
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
