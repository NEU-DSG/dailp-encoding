{ config, lib, pkgs, ... }: 
{
  # Policy Definitions
  config.data.aws_iam_policy_document = {
    basic_user_policy = {
      statement = {
        sid = "TEST-dailp-basic-user-policy";
        actions = ["s3:GetObject"];
        resources = ["bucket arn"];
        principals = {
          type = "AWS";
          identifiers = [ config.resources.aws_iam_role.basic_user_role.arn ];
        };
      };
    };

    contributor_user_policy = {
      statement = {
        sid = "TEST-dailp-contributor-user-policy";
        actions = ["s3:GetObject" "s3:PutObject"];
        resources = ["bucket arn"];
        principals = {
          type = "AWS";
          identifiers = [ config.resources.aws_iam_role.contributor_user_role.arn ];
        };
      };
    };

    editor_user_policy = {
      statement = {
        sid = "TEST-dailp-editor-user-policy";
        actions = ["s3:GetObject"];
        resources = ["bucket arn"];
        principals = {
          type = "AWS";
          identifiers = [ config.resources.aws_iam_role.editor_user_role.arn ];
        };
      };
    };
  };

  # Role Definitions
  config.resource.aws_iam_role = {
    basic_user_role = {
      assume_role_policy = config.data.aws_iam_policy_document.basic_user_policy.json;
      description = "A basic DAILP user with read only s3 access";
      name = "dailp-basic-user-role";
    };

    contributor_user_role = {
      assume_role_policy = config.data.aws_iam_policy_document.contributor_user_policy.json;
      description = "A DAILP contributor with limited read and write s3 access";
      name = "dailp-contributor-user-role";
    };

    editor_user_role = {
      assume_role_policy = config.data.aws_iam_policy_document.editor_user_policy.json;
      description = "A DAILP editor able to perform many s3 actions";
      name = "dailp-editor-user-role";
    };
  };
}