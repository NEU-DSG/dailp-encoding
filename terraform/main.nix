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
  stage_var = getEnv "TF_STAGE";
  # Default to the 'dev' environment unless specified.
  stage = if stage_var == "" then "dev" else stage_var;
in {
  imports = [
    ./bootstrap.nix
    ./functions.nix
    ./auth.nix
    ./website.nix
    ./nu-tags.nix
    ./database-sql.nix
    ./bastion-host.nix
  ];

  # Gives all modules access to which stage we're deploying to, while also
  # verifying that its one of the stages we actually use.
  setup.stage = stage;

  terraform.required_providers.aws = {
    source = "hashicorp/aws";
    version = "~> 3.44";
  };

  # Setup AWS credentials depending on whether we are in the development or
  # production account.
  provider.aws = {
    profile = "neu-${config.setup.stage}";
    region = "us-east-1";
  };

  setup = {
    # Setup the S3 bucket and DynamoDB table that store and manage Terraform state
    # for the current environment.
    state = {
      bucket = "dailp-${config.setup.stage}-terraform-state-bucket";
      table = "dailp-${config.setup.stage}-terraform-state-locks";
    };
    vpc = getEnv "AWS_VPC_ID";
    subnets = {
      primary = getEnv "AWS_SUBNET_PRIMARY";
      secondary = getEnv "AWS_SUBNET_SECONDARY0";
      tertiary = getEnv "AWS_SUBNET_SECONDARY1";
    };
  };

  functions = {
    bucket = "dailp-${config.setup.stage}-functions-bucket";
    security_group_ids = [ "\${aws_security_group.mongodb_access.id}" ];
    functions = [{
      id = "graphql";
      name = "dailp-graphql";
      env = {
        VITE_DEPLOYMENT_ENV = config.setup.stage;
        DATABASE_URL =
          "postgres://\${aws_db_instance.sql_database.username}:${config.servers.database.password}@\${aws_db_instance.sql_database.endpoint}/dailp";
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
    password = getEnv "DATABASE_PASSWORD";
    availability_zone = getEnv "AWS_ZONE_PRIMARY";
    security_group_ids = [ "\${aws_security_group.nixos_test.id}" ];
  };
}
