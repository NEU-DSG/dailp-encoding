{ lib, config, ... }:
{
  options.servers.bastion = with lib; with types; {
    instance_tags = mkOption { type = attrsOf str; };
  };

  config.module.bastion_host = {
    source = "github.com/cloudposse/terraform-aws-ec2-bastion-server?rev=7f8fc52095ef466fedd1c06876e281a1ac6bb75b";
    enabled = true;
    instance_type = "t4g.micro";

    # ID will be constructed from these namespace, stage, and name for some reason.
    namespace = "dailp";
    stage = config.setup.stage;
    name = "bastion";

    assign_eip_address = true;
    associate_public_ip_address = true;
    vpc_id = config.setup.vpc;
    subnets = [config.setup.subnets.primary config.setup.subnets.secondary config.setup.subnets.tertiary];

    # Don't create a new security group for this server.
    security_group_enabled = false;
    # Use the existing one setup for MongoDB access.
    security_groups = ["\${aws_security_group.nixos_test.id}"];

    tags = config.setup.global_tags // config.servers.bastion.instance_tags;
  };
}
