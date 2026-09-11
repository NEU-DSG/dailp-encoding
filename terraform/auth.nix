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
    # A second app client, for scripts. scripts/src/download_from_s3.sh uses it
    # to trade a DAILP email and password for an id token via
    # `aws cognito-idp initiate-auth`, which it then presents to the GraphQL API
    # to obtain a presigned backup URL.
    #
    # USER_PASSWORD_AUTH is here because SRP is not implementable in bash. That
    # is precisely why this is a separate client and why the web client above
    # must stay SRP-only: enabling this flow there would let any web client send
    # a cleartext password.
    #
    # Deliberately absent from aws_cognito_identity_pool.main below, whose
    # cognito_identity_providers and role_mapping both name
    # aws_cognito_user_pool_client.main specifically. This client therefore
    # grants no AWS credentials of any kind -- only an id token, which is all
    # the presign endpoint needs.
    aws_cognito_user_pool_client.cli = {
      name = prefixName "cli-client";
      user_pool_id = "\${aws_cognito_user_pool.main.id}";
      explicit_auth_flows = [ "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" ];
      generate_secret = false; # no SECRET_HASH for a shell script to compute
      supported_identity_providers = [ "COGNITO" ];
      # No allowed_oauth_flows or callback_urls: this client never performs a
      # browser redirect, so hosted-UI configuration would be dead config.
      access_token_validity = 1;
      id_token_validity = 1;
      token_validity_units = {
        access_token = "hours";
        id_token = "hours";
      };
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
      # Gates the backup download fields on the GraphQL API
      # (graphql/src/query.rs). Kept separate from Editors so that holding a
      # full database dump is a deliberate grant rather than a side effect of
      # being able to edit content.
      #
      # The name must be exactly "Administrators": types/src/auth.rs's
      # From<String> for UserGroup panics on any string outside its enum, so a
      # group created by hand as "Admins" or "admin" would turn every member's
      # authenticated request into a 502 that looks like an outage rather than a
      # misconfiguration. Defining it here is what prevents that.
      #
      # Deliberately no role_arn, unlike the two groups above. This group grants
      # no identity-pool AWS credentials: authorization for the backup fields
      # comes from the JWT's cognito:groups claim via the API Gateway Cognito
      # authorizer, and the presigned URLs are signed by the lambda's own role.
      # For the same reason there is no mapping_rule for it below -- see the
      # comment there.
      administrators = {
        name = "Administrators";
        user_pool_id = "\${aws_cognito_user_pool.main.id}";
        description = "Administrators can download database and XML backups.";
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
      # No rule for the Administrators group, on purpose. These rules hand out
      # identity-pool AWS credentials for the browser's direct-to-S3 uploads,
      # which administrators have no need of -- the backup download path never
      # uses identity-pool credentials. Adding a rule would also be risky:
      # match_type = "Equals" compares against the whole cognito:groups claim,
      # so introducing a third rule changes how a user who is in more than one
      # group resolves, and could quietly downgrade an existing editor who is
      # also made an administrator.
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

  # Needed by scripts/src/download_from_s3.sh to authenticate a human before
  # requesting a presigned backup URL. There were no auth outputs before this,
  # so operators had to read these ids out of .env or the console.
  config.output = {
    user_pool_id = {
      value = "\${aws_cognito_user_pool.main.id}";
    };
    cli_user_pool_client_id = {
      value = "\${aws_cognito_user_pool_client.cli.id}";
    };
  };
}
