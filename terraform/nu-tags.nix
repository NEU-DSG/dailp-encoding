{ config, lib, pkgs, ... }:

{
  setup.global_tags = {
    # Placeholder values, these should be sourced from secrets.
    "nu:account-code" = "0000000";
    "nu:index-division" = "0000000";
    "nu:owner" = "dsg";
    "nu:creator" = "dailp-deployment";
    "nu:environment" =
      if config.setup.stage == "dev" then "library-dev" else "library-prod";
    "nu:application" = "dailp";
  };
  servers.database.tags = {
    "nu:function" = "database";
    "nu:backups" = "no";
  };
  servers.mongodb.instance_tags = {
    "nu:function" = "database";
    "nu:os" = "nixos";
    "nu:backups" = "no";
  };
  servers.mongodb.storage_tags = {
    "nu:function" = "database";
    "nu:backups" = "no";
  };
  servers.bastion.instance_tags = {
    "nu:function" = "bastion";
    "nu:os" = "linux";
    "nu:backups" = "no";
  };
  functions.tags = { "nu:function" = "application-server"; };
}
