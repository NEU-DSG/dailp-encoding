{ config, lib, pkgs, ... }: {

  # Provision a bucket dedicated to media storage, especially audio files.
  config.resource = {
    aws_s3_bucket.media_storage = {
      bucket = let 
        prefixName = import ./utils.nix { stage = config.setup.stage; hideProd = false; };
      in prefixName "media-storage";
      lifecycle.prevent_destroy = true;
    };
    aws_s3_bucket_cors_configuration.media_storage_cors = {
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      cors_rule = {
        allowed_headers = ["*"];
        allowed_methods = ["GET" "PUT" "POST"];
        allowed_origins = ["*"];
        expose_headers   = ["ETag"]; # Required for multipart uploads
        max_age_seconds = 3600;
      };
    };
    aws_s3_bucket_acl.media_storage = {
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      acl = "private";
    };
    aws_s3_bucket_versioning.media_storage_versioning = { 
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      versioning_configuration.status = "Enabled";
    };
    aws_s3_bucket_logging.media_storage_logging = {
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      target_bucket = config.setup.access_log_bucket;
      target_prefix = "/dailp-${config.setup.stage}-media-storage";
    };
    aws_s3_bucket_server_side_encryption_configuration.media_storage_encryption = {
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      rule.apply_server_side_encryption_by_default.sse_algorithm = "AES256";
    };
  aws_s3_bucket_policy.media_storage_policy = {
    bucket = "$\{aws_s3_bucket.media_storage.id}";
    policy = "$\{data.aws_iam_policy_document.media_storage_policy_document.json}";
  };
  };

  config.data.aws_iam_policy_document = {
    media_storage_policy_document = {
      policy_id = "PolicyForCloudFrontPrivateContent";
      source_policy_documents =
        let reference_policy = name: "$\{data.aws_iam_policy_document.${name}.json}";
        in [
          (reference_policy "allow_cloudfront_service_principal")
          (reference_policy "allow_dailp_user_principals")
          (reference_policy "allow_dailp_deploy_principal")
          (reference_policy "allow_bastion_backup_writes")
        ];
    };
    allow_cloudfront_service_principal.statement = {
      sid = "AllowCloudFrontServicePrincipal";
      effect = "Allow";
      principals = { 
        type = "Service";
        identifiers = [ "cloudfront.amazonaws.com" ];
      };
      actions = [
        "s3:GetObject"
        "s3:PutObject"
      ];
      resources = [ "$\{aws_s3_bucket.media_storage.arn}/*" ];
      condition = {
        test = "StringEquals";
        variable = "AWS:SourceArn";
        values = [ "$\{aws_cloudfront_distribution.media_distribution.arn}" ];
      };
    };
    allow_dailp_user_principals.statement = {
      sid = "AllowDailpUserPrincipals";
      effect = "Allow";
      principals = {
        type = "AWS";
        identifiers = [
          "$\{aws_iam_role.dailp_user.arn}"
          "$\{aws_iam_role.dailp_user_editor.arn}"
          "$\{aws_iam_role.dailp_user_contributor.arn}"
        ];
      };
      actions = [
        "s3:GetObject"
        "S3:PutObject"
      ];
      resources = [ 
        "$\{aws_s3_bucket.media_storage.arn}/user-uploaded-audio/*"
        "$\{aws_s3_bucket.media_storage.arn}/user-uploaded-images/*"
       ];
    };
    allow_dailp_deploy_principal.statement = {
      sid = "AllowDailpDeployPrincipals";
      effect = "Allow";
      principals = {
        type = "AWS";
        identifiers = 
          if config.setup.stage == "dev" then 
            [ "arn:aws:iam::783177801354:user/dailp-deployment" ]
          else
            [ "arn:aws:iam::363539660090:user/dialp-deployment" ];
      };
      actions = [
        "s3:GetObject"
        "s3:PutObject"
      ];
      resources = [ "$\{aws_s3_bucket.media_storage.arn}/*" ];
    };
    # The Data Backup workflow's database step runs on the bastion, not on the
    # GitHub runner: .github/workflows/data-backup.yml shells in over the SSM
    # tunnel and invokes scripts/src/upload_to_s3.sh there. No AWS credentials
    # are ever shipped across that tunnel, so the `aws s3 cp` executes under the
    # EC2 instance profile rather than the dailp-deployment user granted above.
    #
    # That role comes from the cloudposse ec2-bastion-server module, whose only
    # S3 statement is s3:GetEncryptionConfiguration -- so the upload used to fail
    # with AccessDenied. The grant lives here, on the bucket, rather than on the
    # role, because the module owns its inline policy and cannot be extended from
    # out here, and because the NEU-SysAdmin-Additional-Deny-Permissions boundary
    # denies iam:PutRolePolicy/AttachRolePolicy on this role to human admins.
    # Bucket and role are in the same account, where a resource-based grant alone
    # is sufficient, so nothing further is needed on the identity side.
    #
    # Scoped to db-backups/ deliberately: the bastion writes backups and nothing
    # else, so it has no business touching the user-uploaded prefixes above.
    # AbortMultipartUpload is here because a pg_dump is far over the CLI's
    # multipart threshold -- PutObject covers create/upload/complete, but
    # cleaning up a failed transfer's parts is a separate action.
    allow_bastion_backup_writes.statement = {
      sid = "AllowBastionDbBackupWrites";
      effect = "Allow";
      principals = {
        type = "AWS";
        # Role name from the module output so it tracks namespace/stage/name;
        # account id hardcoded per stage, matching the deploy principal above.
        identifiers =
          if config.setup.stage == "dev" then
            [ "arn:aws:iam::783177801354:role/$\{module.bastion_host.role}" ]
          else
            [ "arn:aws:iam::363539660090:role/$\{module.bastion_host.role}" ];
      };
      actions = [
        "s3:PutObject"
        "s3:AbortMultipartUpload"
      ];
      resources = [ "$\{aws_s3_bucket.media_storage.arn}/db-backups/*" ];
    };
  };
}
