{ config, lib, pkgs, ... }:

{
  setup.global_tags = {
    # Placeholder values, these should be sourced from secrets.
    "nu:index" = "256150";
    "nu:owner" = "dailp";
    "nu:creator" = "sysna.trevino";
    "nu:department" = "library";
    "nu:project" = "dailp";
    "nu:environment" =
      if config.setup.stage == "dev" then "development" else if config.setup.stage == "uat" then "staging" else "production";
    "nu:application" = "dailp-app";
    "nu:notification" = "n.trevino@northeastern.edu";
    "nu:index-division" = "0000000";
    "nu:account-code"   = "0000000";
  };
  servers.database.tags = {
    "nu:function" = "database";
    "nu:backups" = "no";
    "Name" = "DAILP-db";
  };

  functions.tags = { "nu:function" = "application-server"; "Name" = "graphql-endpoint"; };
}
/*
 ~ Local ~
 Name <name you have given the particular resource>
 nu:function 
  function name, e.g. file-server, web-server
  application-server, database, messaging-server, terminal-server/remote-access, cyber/monitoring, virtualization, storage>nu:application dailp-app
*/
