{ config, lib, pkgs, ... }: 
# Local variables for S3 bucket sublocations
let
 document-audio = "document-audio/*";
 word-annotations = "word-annotations-list/*";
 user-audio = "user-uploaded-audio/*";
in {
  # Policy Definitions
  config.data.aws_iam_policy_document = {
    basic_user_policy.statement = {
      sid = "dailp-basic-user-policy";
      effect = "Allow";
      actions = [
        "s3:GetObject"
        "s3:GetObjectAttributes"
        "s3:GetObjectVersion"
        ];
      resources = [
        "$\{bucket arn}/${document-audio}"
        "$\{...}/${word-annotations}"
        "$\{...}/${user-audio}"
        ];
      };

    contributor_user_policy = {
      # Inherit basic permissions
      source_policy_documents = [
        "$\{aws_iam_policy_document.basic_user_policy.json}"
      ];
      # Add contributor permissions
      statement = {
        sid = "dailp-contributor-user-upload-policy";
        actions = [
          "s3:PutObject"
        ];
        resources = [
          "$\{bucket arn}/${user-audio}"
        ];
      }
    };

    # TODO slim down this role's access
    editor_user_policy.statement = {
        sid = "dailp-editor-user-policy";
        actions = [
          "s3:PutObject"
          "s3:GetObject"
          "s3:DeleteObjectVersion"
          "s3:GetObjectAttributes"
          "s3:DeleteObject"
          "s3:GetObjectVersionAttributes"
          "s3:GetObjectVersion"
          ];
        resources = ["bucket arn"];
      }
    };

  # Role Definitions
  config.resource.aws_iam_role = {
    basic_user_role = {
      assume_role_policy = "$\{data.aws_iam_policy_document.basic_user_policy.json}";
      description = "A basic DAILP user with read only s3 access";
      name = "dailp-basic-user-role";
    };

    contributor_user_role = {
      assume_role_policy = "$\{data.aws_iam_policy_document.contributor_user_policy.json}";
      description = "A DAILP contributor with limited read and write s3 access";
      name = "dailp-contributor-user-role";
    };

    editor_user_role = {
      assume_role_policy = "$\{data.aws_iam_policy_document.editor_user_policy.json}";
      description = "A DAILP editor able to perform many s3 actions";
      name = "dailp-editor-user-role";
    };
  };
}