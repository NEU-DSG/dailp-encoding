{ config, lib, pkgs, ... }:

# There are a few naming conventions to keep in mind.
# - Resources and modules should be identified in "snake_case", because that
#   aligns with Terraform conventions.
# - Resource deployment names on AWS should be in "kebab-case", since that's how
#   AWS usually names resources.
# - Variables within the terraform config should be "snake_case" too, aligning
#   with Terraform property names.
# - Functions should be in "camelCase" because that aligns with Nix standard practice.
# - File names in this folder should be "kebab-case.nix"
let
  inherit (builtins) getEnv;
  # Default to the 'dev' environment unless specified.
  stage = if (getEnv "TF_STAGE") == "" || (getEnv "TF_STAGE") == "local" then "dev" else (getEnv "TF_STAGE");
in {
  imports = [
    ./bootstrap.nix
    ./functions.nix
    ./auth.nix
    ./website.nix
    ./nu-tags.nix
    ./database-sql.nix
    ./media-storage.nix
    ./media-access.nix
    ./user-roles.nix
    ./bastion-host.nix
    ./import.nix
    ./outbound-lambda.nix
  ];

  variable = {
    availability_zone_primary = { type = "string"; };
    aws_vpc_id = { type = "string"; };
    aws_subnet_primary = { type = "string"; };
    aws_subnet_secondary = { type = "string"; };
    aws_subnet_tertiary = { type = "string"; };
    aws_subnet_bastion = { type = "string"; };
    bastion_id = { type = "string"; };

    turnstile_site_key = { type = "string"; };
    turnstile_secret_key = {
      type = "string";
      sensitive = true;
    };
    database_password = {
      type = "string";
      sensitive = true;
    };
  };

  module.backups_bucket = {
    source = "${./backups}";
    env_prefix = "dailp-${stage}";
  };

  # Gives all modules access to which stage we're deploying to, while also
  # verifying that its one of the stages we actually use.
  setup.stage = stage;

  terraform.required_providers.aws = {
    source = "hashicorp/aws";
    version = "<= 6.2";
  };

  # Setup AWS credentials depending on whether we are in the development or
  # production account.
  provider.aws = {
    # profile = "neu-${config.setup.stage}";
    region = "us-east-1";
    default_tags.tags = config.setup.global_tags;
  };

  setup = {
    # Setup the S3 bucket and DynamoDB table that store and manage Terraform state
    # for the current environment.
    # Use dev bucket for uat
    state = let 
      prefixName = if config.setup.stage == "uat" then base: "dailp-dev-${base}" else import ./utils.nix { stage = config.setup.stage; hideProd = false; };
    in {
      bucket = prefixName "terraform-state-bucket";
      table = prefixName "terraform-state-locks";
    };
    vpc = "\${var.aws_vpc_id}";
    subnets = {
      primary = "\${var.aws_subnet_primary}";
      secondary = "\${var.aws_subnet_secondary}";
      tertiary = "\${var.aws_subnet_tertiary}";
    };
    bastion_subnet = "\${var.aws_subnet_bastion}";
  };

  functions = 
  let 
    prefixName = import ./utils.nix { stage = config.setup.stage; };
  in {
    bucket = prefixName "functions-bucket";
    security_group_ids = [ "\${aws_security_group.mongodb_access.id}" ];
    functions = [{
      id = "graphql";
      name = prefixName "graphql";
      env = {
        VITE_DEPLOYMENT_ENV = config.setup.stage;
        DATABASE_URL =
          "postgres://\${aws_db_instance.sql_database.username}:${config.servers.database.password}@\${aws_db_instance.sql_database.endpoint}/dailp";
        TURNSTILE_SECRET_KEY = "\${var.turnstile_secret_key}";
        OUTBOUND_LAMBDA_NAME = "\${aws_lambda_function.outbound_turnstile.function_name}";
      };
      endpoints = [
        {
          id = "graphql_read";
          path = "{proxy+}";
          method = "ANY";
          authorization = "NONE";
        }
        {
          id = "graphql_write";
          path = "graphql-edit";
          method = "ANY";
          authorization = "COGNITO_USER_POOLS";
        }
        # {
        #   id = "manifests";
        #   path = "manifests/{id}";
        #   method = "GET";
        #   authorization = "NONE";
        # }
      ];
    }];
  };

  servers.database = {
    password = "\${var.database_password}";
    availability_zone = "\${var.availability_zone_primary}";
    security_group_ids = [ "\${aws_security_group.nixos_test.id}" ];
  };

  # These logging buckets are externally managed.
  setup.access_log_bucket = if config.setup.stage == "prod" then
    "s3-server-access-logs-363539660090"
  else
    "s3-server-access-logs-783177801354";
}
