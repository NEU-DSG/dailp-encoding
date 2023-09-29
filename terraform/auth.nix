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
    # User groups
    aws_cognito_user_group = {
      contributor = {
        name = "Contributors";
        user_pool_id = "\${aws_cognito_user_pool.main.id}";
        description = "Contributors can edit document-related info and upload audio files. Contributors cannot create new collections or add image sources.";
        precedence = 2;
        role_arn = "\${aws_iam_role.contributor_user_role.arn}";
      };
      editor = {
        name = "Editors";
        user_pool_id = "\${aws_cognito_user_pool.main.id}";
        description = "Editors can edit documents and add audio. Editors can also add edited collections.";
        precedence = 1;
        role_arn = "\${aws_iam_role.editor_user_role.arn}";
      };
  };
}
