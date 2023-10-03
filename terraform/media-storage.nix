{ config, lib, pkgs, ... }: {

  # Provision a bucket dedicated to media storage, especially audio files.
  config.resource = {
    aws_s3_bucket.media_storage = {
      bucket = "dailp-${config.setup.stage}-media-storage";
      acl = "private";
      lifecycle.prevent_destroy = true;
      versioning.enabled = true;

      # Currently, this rule is over-inclusive for dev testing. 
      # Before launching to prod, we will want tighter rules
      cors_rule = {
        allowed_headers = ["*"];
        allowed_methods = ["GET" "PUT" "POST"];
        allowed_origins = ["*"];
        max_age_seconds = 3600;
      };
      
      # Copied the rest from the bootstrap bucket.
      logging = {
        target_bucket = config.setup.access_log_bucket;
        target_prefix = "/dailp-${config.setup.stage}-media-storage";
      };
      server_side_encryption_configuration.rule.apply_server_side_encryption_by_default =
      {
        sse_algorithm = "AES256";
      };
    };

  aws_s3_bucket_policy.media_storage_policy = {
    bucket = "$\{aws_s3_bucket.media_storage.id}";
    policy = "$\{data.aws_iam_policy_document.media_storage_policy_document.json}";
  };
  };

  config.data = {
      aws_iam_policy_document.media_storage_policy_document = {
        statement = {
          principals = {
            type = "AWS";
            identifiers = ["*"];
          };
          actions = [
            "*"
          ];
          resources = [

          ];
        };
      };
  };
}
