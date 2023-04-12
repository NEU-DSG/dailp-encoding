{ config, lib, pkgs, ... }: {
  # Provision a bucket dedicated to media storage, especially audio files.
  config.resource.aws_s3_bucket.media_storage = {
    bucket = "dailp-${config.setup.stage}-media-storage";
    tags = config.setup.global_tags;
    acl = "private";
    lifecycle.prevent_destroy = true;
    # We don't need S3 to retain old versions of our media files, especially
    # since NU takes backups anyway (I think).
    versioning.enabled = false;

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
}
