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
{
  imports = [
    ./bootstrap.nix
    ./functions.nix
    ./database-nixos.nix
    ./auth.nix
    ./website.nix
    ./nu-tags.nix
    ./database-sql.nix
  ];

  variable = let
    requiredString = { type = "string"; };
    sensitiveString = requiredString // { sensitive = true; };
  in {
    aws_vpc_id = requiredString;
    aws_subnet_primary = requiredString;
    aws_subnet_secondary0 = requiredString;
    aws_subnet_secondary1 = requiredString;
    aws_zone_primary = requiredString;
    aws_zone_secondary0 = requiredString;
    aws_zone_secondary1 = requiredString;
    git_repository_url = requiredString;

    # Sensitive secret input variables
    database_password = sensitiveString;
    github_oauth_token = sensitiveString;
    aws_ssh_key = sensitiveString;
    cluster_join_token = sensitiveString;
  };

  # Gives all modules access to which stage we're deploying to, while also
  # verifying that its one of the stages we actually use.
  setup.stage = builtins.getEnv "TF_VAR_deployment_stage";

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
    vpc = "\${var.aws_vpc_id}";
    subnets = {
      primary = "\${var.aws_subnet_primary}";
      secondary = "\${var.aws_subnet_secondary0}";
      tertiary = "\${var.aws_subnet_secondary1}";
    };
  };

  functions = {
    bucket = "dailp-${config.setup.stage}-functions-bucket";
    security_group_ids = [ "\${aws_security_group.mongodb_access.id}" ];
    functions = [{
      id = "graphql";
      name = "dailp-graphql";
      env = {
        DATABASE_URL =
          "postgres://\${aws_db_instance.sql_database.username}:${config.servers.database.password}@\${aws_db_instance.sql_database.endpoint}/dailp";
        MONGODB_URI =
          "mongodb://\${aws_instance.mongodb_primary.public_dns}:27017/admin?retryWrites=true&w=majority";
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
    availability_zone = "\${var.aws_zone_primary}";
    security_group_ids = [ "\${aws_security_group.nixos_test.id}" ];
  };

  servers.mongodb.nodes = [
    {
      primary = true;
      availability_zone = "\${var.aws_zone_primary}";
      name = "mongodb_primary";
      subnet_id = config.setup.subnets.primary;
    }
    {
      primary = false;
      availability_zone = "\${var.aws_zone_secondary0}";
      name = "mongodb_secondary0";
      subnet_id = config.setup.subnets.secondary;
    }
    {
      primary = false;
      availability_zone = "\${var.aws_zone_secondary1}";
      name = "mongodb_secondary1";
      subnet_id = config.setup.subnets.tertiary;
    }
  ];
}
