{ config, lib, pkgs, ... }: {

  # Provision a bucket dedicated to database and XML backups.
  #
  # This is deliberately NOT the media bucket. Backups used to live under
  # db-backups/ and xml-backups/ inside dailp-<stage>-media-storage, which is
  # fronted by an unauthenticated CloudFront distribution whose bucket policy
  # grants the CloudFront service principal s3:GetObject on ${bucket}/* --
  # unscoped. Every backup object was therefore world-readable to anyone who
  # knew or guessed the key, and the key is only a UTC timestamp. Key obscurity
  # was the sole access control.
  #
  # This bucket has no CloudFront origin and a full public access block, so it
  # is private by construction rather than by a deny statement someone can
  # later undo. Nothing here should ever gain a distribution; if backups need
  # to be reachable over HTTPS, that is what the presigned-URL path is for.
  #
  # Two access paths, and keeping them separate is the point:
  #   - Restore automation reads directly with `aws s3 cp` under the bastion
  #     instance role. No tokens, no Cognito, no presigning.
  #   - Humans get a short-lived presigned URL from a Cognito-authorized
  #     GraphQL field, gated on the Administrators group.
  config.resource = {
    aws_s3_bucket.backups = {
      bucket = let
        # hideProd = false, matching media-storage.nix: the prod bucket is
        # dailp-prod-backups, not dailp-backups.
        prefixName = import ./utils.nix { stage = config.setup.stage; hideProd = false; };
      in prefixName "backups";
      lifecycle.prevent_destroy = true;
    };

    # No aws_s3_bucket_acl here, unlike media-storage.nix. Buckets created after
    # April 2023 have ACLs disabled (BucketOwnerEnforced) and the public access
    # block fully on by default, so an explicit ACL resource fails with
    # AccessControlListNotSupported unless you *weaken* ownership to
    # ObjectWriter -- the opposite of what this bucket is for. Declaring
    # BucketOwnerEnforced is strictly stronger than acl = "private", which was
    # ceremony anyway: "private" is not a public ACL, so BlockPublicAcls would
    # not have rejected it either way.
    aws_s3_bucket_ownership_controls.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      rule.object_ownership = "BucketOwnerEnforced";
    };

    # The control that makes this bucket different from the media bucket, which
    # has no public access block at all.
    #
    # restrict_public_buckets rejects *public* bucket policies -- ones granting
    # to "*" or to anonymous principals. Every statement below names specific
    # ARNs, so there is no conflict.
    aws_s3_bucket_public_access_block.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      block_public_acls = true;
      block_public_policy = true;
      ignore_public_acls = true;
      restrict_public_buckets = true;
    };

    aws_s3_bucket_versioning.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      versioning_configuration.status = "Enabled";
    };

    aws_s3_bucket_server_side_encryption_configuration.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      rule.apply_server_side_encryption_by_default.sse_algorithm = "AES256";
    };

    aws_s3_bucket_logging.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      target_bucket = config.setup.access_log_bucket;
      # Derived from the bucket rather than hardcoded as in media-storage.nix,
      # so the prefix and the bucket name cannot drift apart.
      target_prefix = "/\${aws_s3_bucket.backups.id}";
    };

    # No aws_s3_bucket_cors_configuration, unlike media-storage.nix: nothing
    # reaches this bucket from a browser. The presigned URLs humans use are
    # fetched by curl or by the browser navigating directly to them, neither of
    # which is a cross-origin XHR.

    # Retention. The media bucket has no lifecycle rules at all, so nothing has
    # ever expired from it despite being versioned.
    #
    # Three traps are load-bearing in how these rules are written:
    #   1. On a versioned bucket, `expiration.days` does NOT delete data. It
    #      writes a delete marker and demotes the current version to noncurrent.
    #      Storage cost is unchanged.
    #   2. `noncurrent_version_expiration` is the rule that actually frees
    #      bytes. Without it the expiration rules above reclaim nothing.
    #   3. The delete markers left by (1) accumulate, and clearing them needs
    #      `expiration.expired_object_delete_marker`, which cannot coexist with
    #      `expiration.days` in the same rule -- hence a separate rule for it.
    #
    # Storage classes: GLACIER_IR (Instant Retrieval), never GLACIER or
    # DEEP_ARCHIVE. A GET against an object in those classes returns
    # InvalidObjectState, so a presigned URL would be perfectly valid and the
    # download would still fail pending a RestoreObject call. GLACIER_IR serves
    # GET directly. It has a 90-day minimum storage duration, which both
    # transition/expiry pairs below respect.
    aws_s3_bucket_lifecycle_configuration.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      # Set explicitly so a change to the provider default cannot move the
      # floor under the transition rules below.
      transition_default_minimum_object_size = "all_storage_classes_128K";
      rule = [
        # The non-negotiable one. The XML upload uses 64 MiB parts with 16
        # concurrent requests on a multi-GB archive, so an aborted run leaves
        # parts that bill indefinitely and are invisible to `aws s3 ls`.
        {
          id = "abort-incomplete-mpu";
          status = "Enabled";
          filter = { };
          abort_incomplete_multipart_upload.days_after_initiation = 7;
        }
        # object_size_greater_than because objects under 128 KB are ineligible
        # for transition but still incur the per-object transition charge, and
        # the logs/ subtrees under both prefixes are all small. Multiple filter
        # criteria have to be combined under `and`.
        {
          id = "db-backups-transition";
          status = "Enabled";
          filter.and = {
            prefix = "db-backups/";
            object_size_greater_than = 131072;
          };
          transition = [
            { days = 30; storage_class = "STANDARD_IA"; }
            { days = 90; storage_class = "GLACIER_IR"; }
          ];
        }
        {
          id = "db-backups-expire";
          status = "Enabled";
          filter.prefix = "db-backups/";
          expiration.days = 365;
          noncurrent_version_expiration = {
            noncurrent_days = 30;
            # Keep the 3 most recent noncurrent versions regardless of age, as
            # insurance against a bad overwrite being aged out.
            newer_noncurrent_versions = 3;
          };
        }
        {
          id = "xml-backups-transition";
          status = "Enabled";
          filter.and = {
            prefix = "xml-backups/";
            object_size_greater_than = 131072;
          };
          transition = [
            { days = 30; storage_class = "GLACIER_IR"; }
          ];
        }
        {
          id = "xml-backups-expire";
          status = "Enabled";
          filter.prefix = "xml-backups/";
          # 180 days keeps objects ~150 days in GLACIER_IR after the 30-day
          # transition, clear of its 90-day minimum. Shortening this below
          # ~120 days would start paying early-deletion penalties.
          expiration.days = 180;
          noncurrent_version_expiration = {
            noncurrent_days = 30;
            newer_noncurrent_versions = 2;
          };
        }
        {
          id = "purge-delete-markers";
          status = "Enabled";
          filter = { };
          expiration.expired_object_delete_marker = true;
        }
      ];
    };

    aws_s3_bucket_policy.backups = {
      bucket = "\${aws_s3_bucket.backups.id}";
      policy = "\${data.aws_iam_policy_document.backups_policy_document.json}";
      # Ordering here is otherwise incidental. The public access block's
      # restrict_public_buckets evaluates the policy, so it should be in place
      # first.
      depends_on = [ "aws_s3_bucket_public_access_block.backups" ];
    };
  };

  config.data.aws_iam_policy_document = {
    backups_policy_document = {
      policy_id = "PolicyForDailpBackups";
      source_policy_documents =
        let reference_policy = name: "\${data.aws_iam_policy_document.${name}.json}";
        in [
          (reference_policy "allow_backup_bastion_writes")
          (reference_policy "allow_backup_bastion_reads")
          (reference_policy "allow_backup_deploy_principal")
          (reference_policy "allow_backup_lambda_reads")
          (reference_policy "allow_backup_listing")
        ];
    };

    # The Data Backup workflow's database step runs on the bastion, not on the
    # GitHub runner: .github/workflows/data-backup.yml shells in over the SSM
    # tunnel and invokes scripts/src/upload_to_s3.sh there. No AWS credentials
    # are ever shipped across that tunnel, so the `aws s3 cp` executes under the
    # EC2 instance profile rather than the dailp-deployment user granted below.
    #
    # That role comes from the cloudposse ec2-bastion-server module, whose only
    # S3 statement is s3:GetEncryptionConfiguration. Every grant it needs
    # therefore lives here, on the bucket, rather than on the role: the module
    # owns its inline policy and cannot be extended from out here, and the
    # NEU-SysAdmin-Additional-Deny-Permissions boundary denies
    # iam:PutRolePolicy/AttachRolePolicy on this role to human admins. Bucket
    # and role are in the same account, where a resource-based grant alone is
    # sufficient, so nothing further is needed on the identity side.
    #
    # AbortMultipartUpload is here because a pg_dump is far over the CLI's
    # multipart threshold -- PutObject covers create/upload/complete, but
    # cleaning up a failed transfer's parts is a separate action.
    allow_backup_bastion_writes.statement = {
      sid = "AllowBastionBackupWrites";
      effect = "Allow";
      principals = {
        type = "AWS";
        # Role name from the module output so it tracks namespace/stage/name;
        # account id hardcoded per stage, matching the deploy principal below.
        identifiers =
          if config.setup.stage == "dev" then
            [ "arn:aws:iam::783177801354:role/\${module.bastion_host.role}" ]
          else
            [ "arn:aws:iam::363539660090:role/\${module.bastion_host.role}" ];
      };
      actions = [
        "s3:PutObject"
        "s3:AbortMultipartUpload"
      ];
      resources = [ "\${aws_s3_bucket.backups.arn}/db-backups/*" ];
    };

    # THIS IS THE RESTORE-AUTOMATION GRANT. It will look unused until a restore
    # job exists -- nothing in the repo downloads a backup today, and
    # scripts/src/download_from_s3.sh has no callers -- so do not delete it as
    # dead configuration.
    #
    # A restore has to reach RDS, and the bastion is inside the VPC, so this is
    # where a restore runs (via `nix run .#run-on-bastion`, the same mechanism
    # the backup workflow already uses for its database half). Covering both
    # prefixes because a restore may want either the pg_dump or the CSV
    # tarball. Read-only: nothing about restoring requires write access here.
    #
    # Deliberately no equivalent grant for dailp-deployment -- see below.
    allow_backup_bastion_reads.statement = {
      sid = "AllowBastionBackupReads";
      effect = "Allow";
      principals = {
        type = "AWS";
        identifiers =
          if config.setup.stage == "dev" then
            [ "arn:aws:iam::783177801354:role/\${module.bastion_host.role}" ]
          else
            [ "arn:aws:iam::363539660090:role/\${module.bastion_host.role}" ];
      };
      actions = [ "s3:GetObject" ];
      resources = [
        "\${aws_s3_bucket.backups.arn}/db-backups/*"
        "\${aws_s3_bucket.backups.arn}/xml-backups/*"
      ];
    };

    # The XML half of the backup workflow runs on the GitHub runner, as the
    # dailp-deployment IAM user, so it needs write access or that upload fails
    # with AccessDenied. GetObject is here for the HeadObject size verification
    # the workflow runs after uploading, which is authorized as s3:GetObject.
    #
    # Scoped to xml-backups/ only, and NOT granted any db-backups/ access of any
    # kind. This asymmetry is deliberate and is the one thing not to "simplify"
    # to ${bucket}/* the way media-storage.nix does: this identity's static
    # access keys live in the Development GitHub environment, so read access
    # here would mean anyone who can trigger a workflow -- or who obtains that
    # secret -- can pull every database dump. Restore runs on the bastion, so
    # the runner never needs to read a dump.
    allow_backup_deploy_principal.statement = [
      {
        sid = "AllowDailpDeployXmlBackupWrites";
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
          "s3:PutObject"
          "s3:AbortMultipartUpload"
          "s3:GetObject"
        ];
        resources = [ "\${aws_s3_bucket.backups.arn}/xml-backups/*" ];
      }
      {
        # The AWS CLI probes this on some upload code paths.
        sid = "AllowDailpDeployBucketLocation";
        effect = "Allow";
        principals = {
          type = "AWS";
          identifiers =
            if config.setup.stage == "dev" then
              [ "arn:aws:iam::783177801354:user/dailp-deployment" ]
            else
              [ "arn:aws:iam::363539660090:user/dialp-deployment" ];
        };
        actions = [ "s3:GetBucketLocation" ];
        resources = [ "\${aws_s3_bucket.backups.arn}" ];
      }
    ];

    # The GraphQL lambda signs presigned GET URLs for human downloads. Signing
    # is a purely local operation, but the URL it produces is only valid if the
    # signing principal itself can perform the action -- hence a real grant.
    #
    # Granted here rather than on the role because
    # aws_iam_role_policy_attachments_exclusive in functions-base.nix is
    # exclusive (it detaches anything not listed) and hardcodes the dev account
    # id with no stage branch. Same reasoning as the bastion grants above.
    allow_backup_lambda_reads.statement = {
      sid = "AllowLambdaBackupReads";
      effect = "Allow";
      principals = {
        type = "AWS";
        # A direct resource reference, unlike the bastion's string-built ARN,
        # because lambda_exec is a first-class resource in this config.
        identifiers = [ "\${aws_iam_role.lambda_exec.arn}" ];
      };
      actions = [ "s3:GetObject" ];
      resources = [
        "\${aws_s3_bucket.backups.arn}/db-backups/*"
        "\${aws_s3_bucket.backups.arn}/xml-backups/*"
      ];
    };

    # ListBucket acts on the bucket ARN, not the object ARNs, which is why it is
    # a separate statement rather than folded into the grants above.
    #
    # Before this, no principal anywhere in this project had s3:ListBucket --
    # which is why download_from_s3.sh's -r/--recursive mode has never worked
    # with the project's own credentials (see the TODO in its header).
    #
    # The s3:prefix condition is what keeps this from being whole-bucket
    # enumeration. Both the bare and slashed forms are required: StringLike
    # "db-backups/*" matches "db-backups/" because * matches empty, but does not
    # match bare "db-backups". A request sending no prefix at all has s3:prefix
    # absent, the condition fails, and the listing is denied -- which is the
    # intent, but it means every caller must always pass a prefix.
    allow_backup_listing.statement = {
      sid = "AllowBackupPrefixListing";
      effect = "Allow";
      principals = {
        type = "AWS";
        identifiers = [
          "\${aws_iam_role.lambda_exec.arn}"
        ] ++ (if config.setup.stage == "dev" then
          [ "arn:aws:iam::783177801354:role/\${module.bastion_host.role}" ]
        else
          [ "arn:aws:iam::363539660090:role/\${module.bastion_host.role}" ]);
      };
      actions = [ "s3:ListBucket" ];
      resources = [ "\${aws_s3_bucket.backups.arn}" ];
      condition = {
        test = "StringLike";
        variable = "s3:prefix";
        values = [
          "db-backups"
          "db-backups/*"
          "xml-backups"
          "xml-backups/*"
        ];
      };
    };
  };

  # Consumed by .github/workflows/data-backup.yml so the workflow's target
  # bucket and this config cannot drift apart.
  config.output.backup_bucket = {
    value = "\${aws_s3_bucket.backups.id}";
  };
}
