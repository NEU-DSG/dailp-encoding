{ config, lib, pkgs, ... }:

with lib;
with builtins; 
let 
  utils = import ./utils.nix;
  prefixName = utils.prefixName;
in {
  config.resource = {
    aws_iam_role.amplify_role = {
      name = prefixName "amplify-role";
      assume_role_policy = toJSON {
        Statement = [{
          Effect = "Allow";
          Principal.Service = "amplify.amazonaws.com";
          Action = "sts:AssumeRole";
        }];
        Version = "2008-10-17";
      };
      inline_policy = {
        name = "Amplify";
        policy = toJSON {
          Statement = [{
            Effect = "Allow";
            Action = "amplify:*";
            Resource = "*";
          }];
        };
      };
    };

    aws_amplify_app.dailp =
      let apiUrl = "\${aws_api_gateway_deployment.functions_api.invoke_url}";
      in {
        lifecycle.prevent_destroy = true;
        name = "dailp";
        description = "Digital Archive of Indigenous Language Persistence";
        repository = lib.toLower (getEnv "GIT_REPOSITORY_URL");
        oauth_token = getEnv "OAUTH_TOKEN";
        iam_service_role_arn = "\${aws_iam_role.amplify_role.arn}";
        custom_rule = [
          {
            source = "/<*>";
            status = "404-200";
            target = "/404.html";
          }
          {
            source = "/api/<*>";
            status = "200";
            target = "${apiUrl}/<*>";
          }
          # TODO Consider removing this one and having all access be under the /api endpoint.
          {
            source = "/graphql";
            status = "200";
            target = "${apiUrl}/graphql";
          }
        ];

        build_spec = toJSON {
          version = "1";
          env.variables = {
            DAILP_API_URL = apiUrl;
            DAILP_AWS_REGION = config.provider.aws.region;
            DAILP_USER_POOL = "\${aws_cognito_user_pool.main.id}";
            DAILP_USER_POOL_CLIENT = "\${aws_cognito_user_pool_client.main.id}";
            DAILP_IDENTITY_POOL = getEnv "DAILP_IDENTITY_POOL";
            TF_STAGE = config.setup.stage;
            VITE_DEPLOYMENT_ENV = config.setup.stage;
          };
          frontend = {
            artifacts = {
              baseDirectory = "website/public";
              files = [ "**/*" ];
            };
            phases = {
              build.commands = [
                "yum install -y curl"
                "curl https://sh.rustup.rs -sSf | sh -s -- -y"
                "source $HOME/.cargo/env"
                "cd website"
                "yarn install"
                "yarn build"
                "cd .."
              ];
            };
            cache.paths = [ "website/node_modules" "target" ];
          };
          customHeaders = [{
            pattern = "**/*.{json,html}";
            headers = [{
              key = "Cache-Control";
              value = "public, max-age=0, must-revalidate";
            }];
          }];
        };
      };

    aws_amplify_branch = let
      branchName = if config.setup.stage == "dev" then "main" else if config.setup.stage == "uat" then "uat" else "release";
      stageName =
        if config.setup.stage == "dev" then "DEVELOPMENT" else "PRODUCTION";
    in {
      current_stage = {
        app_id = "\${aws_amplify_app.dailp.id}";
        branch_name = branchName;
        stage = stageName;
        enable_auto_build = false;
        enable_pull_request_preview = true;
        framework = "Web";
        description = "Primary Deployment Branch";
      };
    };

    aws_amplify_webhook.current_stage = {
      app_id = "\${aws_amplify_app.dailp.id}";
      branch_name = "\${aws_amplify_branch.current_stage.branch_name}";
      description = "Build front-end environment";
    };
  };

  config.output.amplify_webhook = {
    value = "\${aws_amplify_webhook.current_stage.url}";
  };
}
