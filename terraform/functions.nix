{ config, lib, pkgs, ... }:
let
  inherit (builtins) toJSON hashFile hashString map;
  inherit (lib) mkMerge attrValues zipAttrs mkOption;
  api = "functions_api";
in {
  imports = [ ./functions-base.nix ];
  options.functions = with lib.types; {
    bucket = mkOption { type = str; };
    security_group_ids = mkOption { type = listOf str; };
    package_path = mkOption { type = str; };
    functions = mkOption { type = listOf attrs; };
    tags = mkOption {
      type = attrsOf str;
      default = { };
    };
  };

  # Allow CORS on all defined endpoints.
  config.module = mkMerge (map (fun:
    zipAttrs (map (endpoint: {
      "${endpoint.id}_cors" = {
        source = "mewa/apigateway-cors/aws";
        version = "2.0.1";

        api = "\${aws_api_gateway_rest_api.${api}.id}";
        resource = "\${aws_api_gateway_resource.${endpoint.id}.id}";

        methods = [ "POST" "GET" ];
        # Allow any headers for best compatibility with GraphQL clients.
        headers = [ "*" ];
        discard_default_headers = true;
      };
    }) fun.endpoints)) config.functions.functions);
  config.resource = {
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
}
