{ config, lib, pkgs, ... }:

{
  config.resource = {
    aws_cognito_user_pool.main = {
      name = "dailp-user-pool";
      username_attributes = [ "email" ];
      auto_verified_attributes = [ "email" ];
      admin_create_user_config.allow_admin_create_user_only = true;
      tags = config.setup.global_tags;
    };

    aws_cognito_user_pool_client.main = {
      name = "dailp-user-pool-client";
      user_pool_id = "\${aws_cognito_user_pool.main.id}";
      allowed_oauth_flows = [ "implicit" ];
      allowed_oauth_flows_user_pool_client = true;
      allowed_oauth_scopes =
        [ "email" "openid" "profile" "aws.cognito.signin.user.admin" ];
      callback_urls = [ "http://localhost:8000" "http://localhost:9000" ];
      explicit_auth_flows =
        [ "ALLOW_USER_SRP_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" ];
      generate_secret = false;
      supported_identity_providers = [ "COGNITO" ];
    };
    # Standin user group
    aws_cognito_user_group.contributor = {
      name         = "Contributor";
      user_pool_id = "\${aws_cognito_user_pool.main.id}";
      description  = "Managed by Terraform";
      precedence   = 42;
      role_arn     = "\${aws_iam_role.group_role.arn}";
    };
  };
}
