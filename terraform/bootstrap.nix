{ config, lib, pkgs, ... }:
with lib; {
  options.setup = with types; {
    state = {
      bucket = mkOption { type = str; };
      table = mkOption { type = str; };
    };
    access_log_bucket = mkOption { type = str; };
    stage = mkOption { type = enum [ "dev" "prod" ]; };
    vpc = mkOption { type = str; };
    subnets = mkOption { type = attrsOf str; };
    global_tags = mkOption {
      type = attrsOf str;
      default = { };
    };
  };

  config = {
    # This S3 bucket holds the Terraform state file. There should be a separate
    # bucket and table for each stage, like development and production.
    resource.aws_s3_bucket.tf_state_bucket = {
      # Generate a unique bucket name with the given prefix.
      bucket = config.setup.state.bucket;
      acl = "private";
      server_side_encryption_configuration.rule.apply_server_side_encryption_by_default =
        {
          sse_algorithm = "AES256";
        };
      versioning.enabled = true;
      tags = { 
        "Name" = "Terraform state storage";
        "Terraform" = "true";
        # "nu:function" = "storage>nu:application dailp-app";
      } // config.setup.global_tags;
      lifecycle.prevent_destroy = true;
      logging = {
        target_bucket = config.setup.access_log_bucket;
        target_prefix = "/${config.setup.state.bucket}";
      };
    };

    resource.aws_dynamodb_table.tf_lock_state = {
      name = config.setup.state.table;
      billing_mode = "PAY_PER_REQUEST";
      # Hash key is required, and must be an attribute.
      hash_key = "LockID";
      # Attribute LockID is required for Terraform to use this table for lock state.
      attribute = {
        name = "LockID";
        type = "S";
      };
      tags = {
        Name = config.setup.state.table;
        BuiltBy = "Terraform";
      } // config.setup.global_tags;
      lifecycle.prevent_destroy = true;
    };

    # Use the bucket and table provisioned above to fuel Terraform state
    # management. This is a bit of a chicken and egg situation, where the
    # following block is manually disabled until the above resources exist.
    terraform.backend.s3 = {
      profile = config.provider.aws.profile;
      bucket = config.setup.state.bucket;
      key = "terraform.tfstate";
      region = config.provider.aws.region;
      dynamodb_table = config.setup.state.table;
      encrypt = true;
    };
  };
}
