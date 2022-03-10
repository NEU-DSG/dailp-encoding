{ config, lib, pkgs, ... }: {
  options.servers.database = with lib;
    with types; {
      availability_zone = mkOption { type = str; };
      password = mkOption { type = str; };
      security_group_ids = mkOption { type = listOf str; };
      tags = mkOption { type = attrsOf str; };
    };

  config.resource = let name = "dailp-database";
  in {
    aws_db_subnet_group.sql_database = {
      name = name;
      subnet_ids = lib.attrValues config.setup.subnets;
      tags = { Name = "Subnet Group for DAILP"; };
    };

    aws_db_instance.sql_database = {
      identifier = "${name}-primary";
      tags = config.setup.global_tags // config.servers.database.tags;
      instance_class = "db.t4g.medium";
      storage_type = "gp2";
      storage_encrypted = true;
      allocated_storage = 32;
      max_allocated_storage = 128;

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

      # Server times are in UTC, so this is 12am-3am PT
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
  };
}
