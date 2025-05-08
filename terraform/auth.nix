{ config, lib, pkgs, ... }:
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  config.resource = {
    # User Pool Setup
    aws_cognito_user_pool.main = {
      name = "dailp-user-pool";
      username_attributes = [ "email" ];
      auto_verified_attributes = [ "email" ];
      admin_create_user_config.allow_admin_create_user_only = false;  
      verification_message_template = let 
        subdomain = if config.setup.stage == "prod" then "" else (config.setup.stage + ".");
      in {
        email_subject = "Your DAILP account confirmation code";
        email_message = ''
          Hello, thank you for signing up for a DAILP account!
          
          Your confirmation code is {####}. Please enter this code on the confirmation page.
          
          You can access the confirmation page at https://${subdomain}dailp.northeastern.edu/auth/confirmation
        '';
      };
      # lambda_config = {
      #   post_confirmation = "\${aws_lambda_function.post_confirmation_event.arn}";
      # };
    };
    aws_cognito_user_pool_client.main = {
      name = prefixName "user-pool-client";
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
    aws_cognito_user_pool_domain.main = {
      domain = 
      let
        buildUri = prefixName "-";
        cleanUri = uri: builtins.replaceStrings ["--"] [""] uri;
      in cleanUri buildUri;
      user_pool_id = "\${aws_cognito_user_pool.main.id}";
    };

    # User Groups within Pool
    aws_cognito_user_group = {
      contributors = {
        name = "Contributors";
        user_pool_id = "\${aws_cognito_user_pool.main.id}";
        description = "Contributors can edit document-related info and upload audio files. Contributors cannot create new collections or add image sources.";
        precedence = 2;
        role_arn = "\${aws_iam_role.dailp_user_contributor.arn}";
      };
      editors = {
        name = "Editors";
        user_pool_id = "\${aws_cognito_user_pool.main.id}";
        description = "Editors can edit documents and add audio. Editors can also add edited collections.";
        precedence = 1;
        role_arn = "\${aws_iam_role.dailp_user_editor.arn}";
      };
  };
  # Identity Pool
  aws_cognito_identity_pool.main = {
    identity_pool_name = prefixName "user-identities";
    allow_unauthenticated_identities = true; 
    cognito_identity_providers = {
      client_id = "\${aws_cognito_user_pool_client.main.id}";
      provider_name = "\${aws_cognito_user_pool.main.endpoint}";
      server_side_token_check = false;
    };
  };
  aws_cognito_identity_pool_roles_attachment.main = {
    identity_pool_id = "\${aws_cognito_identity_pool.main.id}";
    role_mapping = {
      identity_provider = "\${aws_cognito_user_pool.main.endpoint}:\${aws_cognito_user_pool_client.main.id}";
      ambiguous_role_resolution = "AuthenticatedRole";
      type = "Rules";
      mapping_rule = [
        {
          claim = "cognito:groups";
          match_type = "Equals";
          value = "Editors";
          role_arn = "\${aws_iam_role.dailp_user_editor.arn}";
        }
        {
          claim = "cognito:groups";
          match_type = "Equals";
          value = "Contributors";
          role_arn = "\${aws_iam_role.dailp_user_contributor.arn}";
        }
      ];
    };
    roles = {
      authenticated = "\${aws_iam_role.dailp_user.arn}";
      unauthenticated = "\${aws_iam_role.dailp_user.arn}";
    };
  };
};
}
