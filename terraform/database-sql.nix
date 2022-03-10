{ config, lib, pkgs, ... }: {
  options.servers.database = with lib;
    with types; {
      availability_zone = mkOption { type = str; };
      password = mkOption { type = str; };
      security_group_ids = mkOption { type = listOf str; };
    };

  config.resource = let name = "dailp-database";
  in {
    aws_db_subnet_group."${name}" = {
      name = name;
      subnet_ids = lib.attrValues config.setup.subnets;
      tags = { Name = "Subnet Group for DAILP"; };
    };

    aws_db_instance."${name}" = {
      identifier = "${name}-primary";
      instance_class = "db.t4g.medium";
      storage_type = "gp2";
      storage_encrypted = true;
      allocated_storage = 32;
      max_allocated_storage = 128;

      engine = "postgresql";
      engine_version = "14";
      allow_major_version_upgrade = false;
      auto_minor_version_upgrade = true;
      username = "admin";
      password = config.servers.database.password;

      publicly_accessible = false;
      multi_az = false;
      availability_zone = config.servers.database.availability_zone;
      db_subnet_group_name = name;
      vpc_security_group_ids = config.servers.database.security_group_ids;
    };
  };
}
