{ config, lib, pkgs, ... }:
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  config.resource = {
    aws_lambda_function.post_confirmation_event = {
      function_name = "dailp_post_user_confirmation";
      role = "$\{aws_iam_role.lambda_exec.arn}";
      architectures = [ "x86_64" ];
      description = ''
        To be invoked by Cognito on PostConfirmation. 
        Adds a user to a group if their email is in a predefined list.
      '';
      environment.variables = {
        DAILP_AWS_REGION = builtins.getEnv "DAILP_AWS_REGION";
        GOOGLE_API_KEY = builtins.getEnv "GOOGLE_API_KEY";
        DAILP_USER_POOL = builtins.getEnv "DAILP_USER_POOL";
      };
      filename = "${config.functions.package_path}/dailp-auth-post-confirmation.zip";
      handler="function_handler";
      runtime="provided.al2";
      timeout=60;
    };

    aws_lambda_permission.allow_cognito_invocation = {
      action = "lambda:InvokeFunction";
      function_name = "$\{aws_lambda_function.post_confirmation_event.name}";
      principal = "cognito-idp.amazonaws.com";
      source_arn = "$\{aws_cognito_user_pool.main.arn}";
    };
  };
}
