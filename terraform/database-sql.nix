{ config, lib, pkgs, ... }: 
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  options.servers.database = with lib;
    with types; {
      availability_zone = mkOption { type = str; };
      password = mkOption { type = str; };
      security_group_ids = mkOption { type = listOf str; };
      tags = mkOption { type = attrsOf str; };
    };

  config.resource = let name = prefixName "database";
  in {
    aws_db_subnet_group.sql_database = {
      name = name;
      subnet_ids = lib.attrValues config.setup.subnets;
      tags = { Name = "Subnet Group for DAILP"; };
      lifecycle.create_before_destroy = true;
    };

    aws_db_instance.sql_database = {
      identifier = "${name}-primary";
      tags = config.setup.global_tags // config.servers.database.tags;
      instance_class = "db.t4g.medium";
      storage_type = "gp2";
      storage_encrypted = true;
      allocated_storage = 32;
      max_allocated_storage = 128;
      lifecycle.create_before_destroy = true;

      engine = "postgres";
      engine_version = "14";
      port = 5432;
      allow_major_version_upgrade = false;
      auto_minor_version_upgrade = true;
      username = "dailp";
      password = config.servers.database.password;

      publicly_accessible = false;
      multi_az = false;
      availability_zone = config.servers.database.availability_zone;
      db_subnet_group_name = name;
      vpc_security_group_ids = config.servers.database.security_group_ids;
      final_snapshot_identifier = "${name}-primary-final-snapshot";
      backup_retention_period = 14;
      backup_window = "07:00-07:59";

      # Server times are in UTC, so this is 12am-3am PT
      apply_immediately = true;
      maintenance_window = "Tue:08:00-Tue:11:00";
    };

    aws_security_group_rule.sql_database_external = {
      type = "ingress";
      security_group_id = "\${aws_security_group.nixos_test.id}";
      source_security_group_id = "\${aws_security_group.mongodb_access.id}";
      description = "RDS external access";
      protocol = "tcp";
      from_port = 5432;
      to_port = 5432;
    };

    aws_security_group.nixos_test = {
      name = prefixName "nixos-test";
      vpc_id = config.setup.vpc;
      description = "MongoDB on NixOS test";
      lifecycle.create_before_destroy = true;
    };

    aws_security_group.mongodb_access = {
      name = prefixName "mongodb-access";
      vpc_id = config.setup.vpc;
      description = "Access DAILP MongoDB servers";
      ingress = [ ];
      egress = [{
        description = "All egress";
        from_port = 0;
        to_port = 0;
        protocol = "-1";
        cidr_blocks = [ "0.0.0.0/0" ];
        ipv6_cidr_blocks = [ "::/0" ];
        self = false;
        security_groups = [ ];
        prefix_list_ids = [ ];
      }];
      lifecycle.create_before_destroy = true;
    };
  };

  config.output.database_address = {
    value = "\${aws_db_instance.sql_database.address}";
  };
  config.output.access_security_group_id = {
    value = "\${aws_security_group.nixos_test.id}";
  };
}
