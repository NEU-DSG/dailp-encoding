{ config, lib, pkgs, ...} : {

config.resource = {
  aws_cloudfront_origin_access_control.media_access_control = {
    name = "dailp-${config.setup.stage}-media-access-control";
    description = "test cloudfront for dailp s3 access via cognito";
    origin_access_control_origin_type = "s3";
    signing_behavior = "always";
    signing_protocol = "sigv4";
  };

  # Provision a CloudForm Distribution to manage Read/Write operations to S3
  aws_cloudfront_distribution.media_distribution = {
    enabled = true;
    origin = {
      domain_name = "$\{aws_s3_bucket.media_storage.bucket_regional_domain_name}";
      origin_id = "$\{aws_s3_bucket.media_storage.id}";
      origin_access_control_id = "$\{aws_cloudfront_origin_access_control.media_access_control.id}";
    };
    default_cache_behavior = {
      allowed_methods = ["DELETE" "GET" "HEAD" "OPTIONS" "PATCH" "POST" "PUT"];
      cached_methods = ["GET" "HEAD"];
      target_origin_id = "$\{aws_s3_bucket.media_storage.id}";
      viewer_protocol_policy = "redirect-to-https";
      cache_policy_id = "$\{data.aws_cloudfront_cache_policy.media-cache-policy.id}";
    };
    restrictions = {
      geo_restriction = {
        restriction_type = "none";
        locations = [];
      };
    };
    viewer_certificate = {
      cloudfront_default_certificate = true;
    };
  };
};

  config.data.aws_cloudfront_cache_policy.media-cache-policy = {
    name = "dailp-${config.setup.stage}-media-cache-policy";
  };
}