{ config, lib, pkgs, ... }: {

  # Provision a bucket dedicated to media storage, especially audio files.
  config.resource = {
    aws_s3_bucket.media_storage = {
      bucket =  "20260811-bogus-media-storage-bucket";
      lifecycle.prevent_destroy = true;
    };
    aws_s3_bucket_cors_configuration.media_storage_cors = {
      bucket = "$\{aws_s3_bucket.media_storage.id}";
      cors_rule = {
        allowed_headers = ["*"];
        allowed_methods = ["GET" "PUT" "POST"];
        allowed_origins = ["*"];
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
  };
}
