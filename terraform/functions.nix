{ config, lib, pkgs, ... }:
let
  inherit (builtins) toJSON hashFile hashString map;
  inherit (lib) mkMerge attrValues zipAttrs mkOption;
  api = "functions_api";
  mkEndpoint = { id, path, method, function, authorization }:
    let apiId = "\${aws_api_gateway_rest_api.${api}.id}";
    in {
      aws_api_gateway_resource."${id}" = {
        rest_api_id = apiId;
        parent_id = "\${aws_api_gateway_rest_api.${api}.root_resource_id}";
        path_part = path;
      };

      aws_api_gateway_method."${id}" = {
        rest_api_id = apiId;
        resource_id = "\${aws_api_gateway_resource.${id}.id}";
        http_method = method;
        authorization = authorization;
        authorizer_id = if authorization == "NONE" then
          null
        else
          "\${aws_api_gateway_authorizer.functions_api.id}";
      };

      aws_api_gateway_integration."${id}" = {
        rest_api_id = apiId;
        resource_id = "\${aws_api_gateway_method.${id}.resource_id}";
        http_method = method;

        integration_http_method = "POST";
        type = "AWS_PROXY";
        uri = "\${aws_lambda_function.${function}.invoke_arn}";
      };
    };
  mkLambda = fun@{ id, name, endpoints, env }:
    mkMerge [
      {
        aws_lambda_function."${id}" = {
          lifecycle.prevent_destroy = true;
          function_name = name;
          filename = "${config.functions.package_path}/${name}.zip";
          runtime = "provided.al2";
          handler = name;
          role = "\${aws_iam_role.lambda_exec.arn}";
          memory_size = 512;
          timeout = 30;
          publish = false;
          vpc_config = {
            subnet_ids = attrValues config.setup.subnets;
            security_group_ids = config.functions.security_group_ids;
          };
          environment.variables = env;
          tags = config.setup.global_tags // config.functions.tags;
        };
        aws_lambda_permission."${id}" = {
          statement_id = "AllowAPIGatewayInvoke";
          action = "lambda:InvokeFunction";
          function_name = name;
          principal = "apigateway.amazonaws.com";

          # The "/*/*" portion grants access from any method on any resource
          # within the API Gateway REST API.
          source_arn = "\${aws_api_gateway_rest_api.${api}.execution_arn}/*/*";
        };
      }
      (mkMerge (map mkEndpoint
        (map (input: input // { function = fun.id; }) endpoints)))
    ];
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

  config.resource = mkMerge (map mkLambda config.functions.functions);

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
}
