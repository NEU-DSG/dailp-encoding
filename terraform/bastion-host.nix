{ lib, config, ... }: {
  options.servers.bastion = with lib;
    with types; {
      instance_tags = mkOption { type = attrsOf str; };
    };

  config.module.bastion_host = {
    source =
      "github.com/cloudposse/terraform-aws-ec2-bastion-server?ref=7f8fc52095ef466fedd1c06876e281a1ac6bb75b";
    enabled = true;
    instance_type = "t4g.micro";
    ami = "ami-03190fe20ef6b1419";

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

  config.output.bastion_ip = { value = "\${module.bastion_host.public_ip}"; };
}