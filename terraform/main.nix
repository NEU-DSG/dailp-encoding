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
    tf_stage = { type = "string"; };
    availability_zone_primary = { type = "string"; };
    aws_vpc_id = { type = "string"; };
    aws_subnet_primary = { type = "string"; };
    aws_subnet_secondary = { type = "string"; };
    aws_subnet_tertiary = { type = "string"; };
    aws_subnet_bastion = { type = "string"; };
    bastion_id = { type = "string"; };
    git_repository_url = { type = "string"; };

    turnstile_site_key = { type = "string"; };
    turnstile_secret_key = {
      type = "string";
      sensitive = true;
    };
    oauth_token = {
      type = "string";
      sensitive = true;
    };
    database_password = {
      type = "string";
      sensitive = true;
    };
  };
  locals = {
    stage = "\${var.tf_stage == \"\" || var.tf_stage == \"local\" ? \"dev\" : var.tf_stage}";
  };

  module.backups_bucket = {
    source = "${./backups}";
    env_prefix = "dailp-\${local.stage}";
  };

  # Gives all modules access to which stage we're deploying to, while also
  # verifying that its one of the stages we actually use.
  setup.stage = (if (builtins.getEnv "TF_STAGE") == "" || (builtins.getEnv "TF_STAGE") == "local" then "dev" else (builtins.getEnv "TF_STAGE"));

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
    state = {
      bucket =
          if config.setup.stage == "uat"
	  then "dailp-dev-terraform-state-bucket"
	  else "dailp${"-${config.setup.stage}"}-terraform-state-bucket";
      table =
          if config.setup.stage == "uat"
	  then "dailp-dev-terraform-state-locks"
	  else "dailp${"-${config.setup.stage}"}-terraform-state-locks";
    };
    vpc = "\${var.aws_vpc_id}";
    subnets = {
      primary = "\${var.aws_subnet_primary}";
      secondary = "\${var.aws_subnet_secondary}";
      tertiary = "\${var.aws_subnet_tertiary}";
    };
    bastion_subnet = "\${var.aws_subnet_bastion}";
  };

  functions = {
    bucket = ("dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-functions-bucket");
    security_group_ids = [ "\${aws_security_group.mongodb_access.id}" ];
    functions = [{
      id = "graphql";
      name = ("dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-graphql");
      env = {
        VITE_DEPLOYMENT_ENV = "\${local.stage}";
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

    # --- Inlined Expansion of graphql function ---
    # This replaces the previous mkLambda(graphql) call.
    aws_lambda_function.graphql = {
      lifecycle.prevent_destroy = false;
      lifecycle.create_before_destroy = true;
      function_name = "dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-graphql";
      filename = "${config.functions.package_path}/dailp-graphql.zip";
      runtime = "provided.al2";
      architectures = [ "x86_64" ];
      handler = "dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-graphql";
      role = "\${aws_iam_role.lambda_exec.arn}";
      memory_size = 512;
      timeout = 30;
      publish = false;
      vpc_config = {
        subnet_ids = lib.attrValues config.setup.subnets;
        security_group_ids = config.functions.security_group_ids;
      };
      environment.variables = {
        VITE_DEPLOYMENT_ENV = "\${local.stage}";
        DATABASE_URL = "postgres://\${aws_db_instance.sql_database.username}:${config.servers.database.password}@\${aws_db_instance.sql_database.endpoint}/dailp";
        TURNSTILE_SECRET_KEY = "\${var.turnstile_secret_key}";
        OUTBOUND_LAMBDA_NAME = "\${aws_lambda_function.outbound_turnstile.function_name}";
      };
      tags = config.setup.global_tags // config.functions.tags;
    };

    aws_lambda_permission.graphql = {
      statement_id = "AllowAPIGatewayInvoke";
      action = "lambda:InvokeFunction";
      function_name = "dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-graphql";
      principal = "apigateway.amazonaws.com";
      source_arn = "\${aws_api_gateway_rest_api.functions_api.execution_arn}/*/*";
    };

    aws_api_gateway_resource.graphql_read = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      parent_id = "\${aws_api_gateway_rest_api.functions_api.root_resource_id}";
      path_part = "{proxy+}";
    };

    aws_api_gateway_method.graphql_read = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      resource_id = "\${aws_api_gateway_resource.graphql_read.id}";
      http_method = "ANY";
      authorization = "NONE";
      authorizer_id = null;
    };

    aws_api_gateway_integration.graphql_read = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      resource_id = "\${aws_api_gateway_method.graphql_read.resource_id}";
      http_method = "ANY";
      integration_http_method = "POST";
      type = "AWS_PROXY";
      uri = "\${aws_lambda_function.graphql.invoke_arn}";
    };

    aws_api_gateway_resource.graphql_write = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      parent_id = "\${aws_api_gateway_rest_api.functions_api.root_resource_id}";
      path_part = "graphql-edit";
    };

    aws_api_gateway_method.graphql_write = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      resource_id = "\${aws_api_gateway_resource.graphql_write.id}";
      http_method = "ANY";
      authorization = "COGNITO_USER_POOLS";
      authorizer_id = "\${aws_api_gateway_authorizer.functions_api.id}";
    };

    aws_api_gateway_integration.graphql_write = {
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      resource_id = "\${aws_api_gateway_method.graphql_write.resource_id}";
      http_method = "ANY";
      integration_http_method = "POST";
      type = "AWS_PROXY";
      uri = "\${aws_lambda_function.graphql.invoke_arn}";
    };
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
