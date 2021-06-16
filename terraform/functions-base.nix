{ config, lib, pkgs, ... }:

{
  config.resource = {
    aws_iam_role.lambda_exec = {
      name = "dailp-lambda-execution";
      managed_policy_arns = [
        "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
      ];
      assume_role_policy = ''
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Principal": {
                "Service": "lambda.amazonaws.com"
              },
              "Effect": "Allow",
              "Sid": ""
            }
          ]
        }
      '';
      lifecycle.prevent_destroy = true;
    };

    # The "REST API" is the container for all of the other API Gateway objects you will create.
    aws_api_gateway_rest_api.functions_api = {
      name = "dailp-api";
      description = "DAILP API for GraphQL endpoints and REST endpoints";
      lifecycle.prevent_destroy = true;
    };

    aws_api_gateway_authorizer.functions_api = {
      name = "DailpUserPoolAuthorizer";
      type = "COGNITO_USER_POOLS";
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      provider_arns = [ "\${aws_cognito_user_pool.main.arn}" ];
    };

    aws_api_gateway_deployment.functions_api = {
      # Redeploy the API if this file changes, or any functions config changes.
      triggers = {
        functionsFile = builtins.hashFile "sha1" ./functions.nix;
        functionsBaseFile = builtins.hashFile "sha1" ./functions-base.nix;
        config = builtins.hashString "sha1" (builtins.toJSON config.functions);
      };
      # These triggers make deployment wait until the main API and CORS
      # integrations are finished.
      depends_on = lib.concatMap (fun:
        lib.concatMap
        (e: [ "module.${e.id}_cors" "aws_api_gateway_integration.${e.id}" ])
        fun.endpoints) config.functions.functions;
      rest_api_id = "\${aws_api_gateway_rest_api.functions_api.id}";
      stage_name = config.setup.stage;
    };
  };

  config.output.functions_url = {
    value = "\${aws_api_gateway_deployment.functions_api.invoke_url}";
  };
}
