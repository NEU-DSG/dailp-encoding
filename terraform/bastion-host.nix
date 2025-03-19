{ lib, config, ... }: {
  options.servers.bastion = with lib;
    with types; {
      instance_tags = mkOption { type = attrsOf str; };
    };

  config.module.bastion_host.resource = let 
      bastionName = (import ./utils.nix { stage = config.setup.stage; }) "bastion";
    in {
    aws_iam_role.default = {
      name = bastionName;
      id = bastionName;
      force_detach_policies = false;
      managed_policy_arns = [];
      max_session_duration = 3600;
      path = "/";
      unique_id = "AROA3MWII32FEWIDB2EY3";

      assume_role_policy    = ''jsonencode(
            {
              Statement = [
                  {
                      Action    = "sts:AssumeRole"
                      Effect    = "Allow"
                      Principal = {
                          Service = "ec2.amazonaws.com"
                        }
                      Sid       = ""
                    },
                ]
              Version   = "2012-10-17"
            }
        )'';
        inline_policy = {
          name   = bastionName;
          policy = ''jsonencode(
                {
                  Statement = [
                      {
                          Action   = [
                              "ssm:UpdateInstanceInformation",
                              "ssm:UpdateInstanceAssociationStatus",
                              "ssm:UpdateAssociationStatus",
                              "ssm:PutInventory",
                              "ssm:PutConfigurePackageResult",
                              "ssm:PutComplianceItems",
                              "ssm:ListInstanceAssociations",
                              "ssm:ListAssociations",
                              "ssm:GetParameters",
                              "ssm:GetParameter",
                              "ssm:GetManifest",
                              "ssm:GetDocument",
                              "ssm:GetDeployablePatchSnapshotForInstance",
                              "ssm:DescribeDocument",
                              "ssm:DescribeAssociation",
                            ]
                          Effect   = "Allow"
                          Resource = "*"
                          Sid      = ""
                      },
                      {
                          Action   = [
                              "ssmmessages:OpenDataChannel",
                              "ssmmessages:OpenControlChannel",
                              "ssmmessages:CreateDataChannel",
                              "ssmmessages:CreateControlChannel",
                            ]
                          Effect   = "Allow"
                          Resource = "*"
                          Sid      = ""
                        },
                      {
                          Action   = [
                              "ec2messages:SendReply",
                              "ec2messages:GetMessages",
                              "ec2messages:GetEndpoint",
                              "ec2messages:FailMessage",
                              "ec2messages:DeleteMessage",
                              "ec2messages:AcknowledgeMessage",
                            ]
                          Effect   = "Allow"
                          Resource = "*"
                          Sid      = ""
                        },
                      {
                          Action   = "s3:GetEncryptionConfiguration"
                          Effect   = "Allow"
                          Resource = "*"
                          Sid      = ""
                        },
                    ]
                  Version   = "2012-10-17"
                }
            )'';
        };
    };
    aws_iam_role_policy.main = {
      id = "${bastionName}:${bastionName}";
      name = bastionName;
      role = bastionName;
      policy = ''
        jsonencode(
          {
              Statement = [
                  {
                      Action   = [
                          "ssm:UpdateInstanceInformation",
                          "ssm:UpdateInstanceAssociationStatus",
                          "ssm:UpdateAssociationStatus",
                          "ssm:PutInventory",
                          "ssm:PutConfigurePackageResult",
                          "ssm:PutComplianceItems",
                          "ssm:ListInstanceAssociations",
                          "ssm:ListAssociations",
                          "ssm:GetParameters",
                          "ssm:GetParameter",
                          "ssm:GetManifest",
                          "ssm:GetDocument",
                          "ssm:GetDeployablePatchSnapshotForInstance",
                          "ssm:DescribeDocument",
                          "ssm:DescribeAssociation",
                        ]
                      Effect   = "Allow"
                      Resource = "*"
                      Sid      = ""
                    },
                  {
                      Action   = [
                          "ssmmessages:OpenDataChannel",
                          "ssmmessages:OpenControlChannel",
                          "ssmmessages:CreateDataChannel",
                          "ssmmessages:CreateControlChannel",
                        ]
                      Effect   = "Allow"
                      Resource = "*"
                      Sid      = ""
                    },
                  {
                      Action   = [
                          "ec2messages:SendReply",
                          "ec2messages:GetMessages",
                          "ec2messages:GetEndpoint",
                          "ec2messages:FailMessage",
                          "ec2messages:DeleteMessage",
                          "ec2messages:AcknowledgeMessage",
                        ]
                      Effect   = "Allow"
                      Resource = "*"
                      Sid      = ""
                    },
                  {
                      Action   = "s3:GetEncryptionConfiguration"
                      Effect   = "Allow"
                      Resource = "*"
                      Sid      = ""
                    },
                ]
              Version   = "2012-10-17"
            }
        )
      '';
    };
  };
}