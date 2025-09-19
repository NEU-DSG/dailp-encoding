{ config, lib, pkgs, ... }: 
let
 # Local variables for S3 bucket sublocations
 media-storage = "$\{aws_s3_bucket.media_storage.arn}";
 document-audio = "document-audio/*";
 word-annotations = "word-annotations-list/*";
 user-audio = "user-uploaded-audio/*";
 prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  # Policy Documents
  config.data.aws_iam_policy_document = {
    assume_role_policy.statement = {
      effect = "Allow";
      principals = {
        type = "Federated";
        identifiers = [
          "cognito-identity.amazonaws.com"
          ];
      };
      actions = [ "sts:AssumeRoleWithWebIdentity" ];
      condition = {
        test = "StringEquals";
        variable = "cognito-identity.amazonaws.com:aud";
        values = [
          "$\{aws_cognito_identity_pool.main.id}"
        ];
      };
    };

    trusted_assume_role_policy.statement = {
      effect = "Allow";
      principals = {
        type = "Federated";
        identifiers = [
          "cognito-identity.amazonaws.com"
          ];
      };
      actions = [ "sts:AssumeRoleWithWebIdentity" ];
      condition = [
        {
        test = "StringEquals";
        variable = "cognito-identity.amazonaws.com:aud";
        values = [
          "$\{aws_cognito_identity_pool.main.id}"
          ];
      }
      {
        test = "ForAnyValue:StringLike";
        variable = "cognito-identity.amazonaws.com:amr";
        values = [
          "authenticated"
          ];
      }
      ];
    };

    basic_user_policy.statement = {
      sid = "DailpBasicUserPolicy";
      effect = "Allow";
      actions = [
        "s3:GetObject"
        "s3:GetObjectAttributes"
        "s3:GetObjectVersion"
        ];
      resources = [
        "${media-storage}/${document-audio}"
        "${media-storage}/${word-annotations}"
        "${media-storage}/${user-audio}"
        ];
      };

    contributor_user_policy = {
      # Inherit basic permissions
      source_policy_documents = [
        "$\{data.aws_iam_policy_document.basic_user_policy.json}"
      ];
      # Add contributor permissions
      statement = {
        sid = "DailpContributorUserUploadPolicy";
        actions = [
          "s3:PutObject"
        ];
        resources = [
          "${media-storage}/${user-audio}"
        ];
      };
    };
    editor_user_policy.statement = {
        sid = "DailpEditorUserPolicy";
        actions = [
          "s3:PutObject"
          "s3:GetObject"
          "s3:DeleteObjectVersion"
          "s3:GetObjectAttributes"
          "s3:DeleteObject"
          "s3:GetObjectVersionAttributes"
          "s3:GetObjectVersion"
          ];
        resources = ["${media-storage}/*"];
      };
      administrator_user_policy.statement = {
        sid = "DailpAdministratorUserPolicy";
        actions = [
          "s3:PutObject"
          "s3:GetObject"
          "s3:DeleteObjectVersion"
          "s3:GetObjectAttributes"
          "s3:DeleteObject"
          "s3:GetObjectVersionAttributes"
          "s3:GetObjectVersion"
          ];
        resources = ["${media-storage}/*"];
      };
    };

  config.resource = {
    # Policy Resource Definitions
    aws_iam_policy = {
      dailp_basic_user_policy = {
        policy = "$\{data.aws_iam_policy_document.basic_user_policy.json}";
        name = prefixName "basic-user-policy";
        description = "Allows minimal S3 read permissions for unauthenticated users.";
      };
      dailp_editor_policy = {
        policy = "$\{data.aws_iam_policy_document.editor_user_policy.json}";
        name = prefixName "editor-policy";
        description = "A policy giving editors permission to read and write to DAILPs S3 media bucket";
      };
      dailp_user_contributor_policy = {
        policy = "$\{data.aws_iam_policy_document.contributor_user_policy.json}";
        name = prefixName "user-contributor-policy";
        description = "Permissions for DAILP users at the Contributor level.";
      };
      dailp_administrator_policy = {
        policy = "$\{data.aws_iam_policy_document.administrator_user_policy.json}";
        name = prefixName "administrator-policy";
        description = "Permissions for DAILP users at the Admin level.";
      };
    };
    # Role Resource Definitions
    aws_iam_role = 
    let
      trust-policy = "$\{data.aws_iam_policy_document.assume_role_policy.json}";
      authed-trust-policy = "$\{data.aws_iam_policy_document.trusted_assume_role_policy.json}";
    in {
      dailp_user = {
        assume_role_policy = trust-policy;
        description = "A basic unauthenticated DAILP user";
        name = prefixName "user";
      };
      dailp_user_contributor = {
        assume_role_policy = authed-trust-policy;
        description = "A DAILP user with basic read/update permissions.";
        name = prefixName "user-contributor";
      };
      dailp_user_editor = {
        assume_role_policy = authed-trust-policy;
        description = "A user with editorial permissions on DAILP";
        name = prefixName "user-editor";
      };
      dailp_user_administrator = {
        assume_role_policy = authed-trust-policy;
        description = "A user with admin permissions on DAILP";
        name = prefixName "user-administrator";
      };
    };
    # Bind permissions policies to roles
    aws_iam_role_policy_attachment = {
      basic_user = {
        role = "$\{aws_iam_role.dailp_user.name}";
        policy_arn = "$\{aws_iam_policy.dailp_basic_user_policy.arn}";
      };
      editor = {
        role = "$\{aws_iam_role.dailp_user_editor.name}";
        policy_arn = "$\{aws_iam_policy.dailp_editor_policy.arn}";
      };
      contributor = {
        role = "$\{aws_iam_role.dailp_user_contributor.name}";
        policy_arn = "$\{aws_iam_policy.dailp_user_contributor_policy.arn}";
      };
      administrator = {
        role = "$\{aws_iam_role.dailp_user_administrator.name}";
        policy_arn = "$\{aws_iam_policy.dailp_administrator_policy.arn}";
      };
    };
  };
}