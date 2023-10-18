{ config, lib, pkgs, ...} : let 
  utils = import ./utils.nix;
  prefixName = utils.prefixName;
in {
config.resource = {
  aws_cloudfront_origin_access_control.media_access_control = {
    name = prefixName "media-storage.s3.${config.provider.aws.region}.amazonaws.com";
    description = "Cloudfront DAILP media access";
    origin_access_control_origin_type = "s3";
    signing_behavior = "always";
    signing_protocol = "sigv4";
  };

  # Provision a CloudForm Distribution to manage Read/Write operations to S3
  aws_cloudfront_distribution.media_distribution = {
    enabled = true;
    origin = 
    let
      bucket-location = "$\{aws_s3_bucket.media_storage.id}.s3.$\{aws_s3_bucket.media_storage.region}.amazonaws.com";
    in {
      domain_name = bucket-location;
      origin_id = bucket-location;
      origin_access_control_id = "$\{aws_cloudfront_origin_access_control.media_access_control.id}";
    };
    default_cache_behavior = 
    let 
      # AWS managed caching policies
      managed-cache-policy = {
        # ID for policy Managed-Caching Optimized
        caching-optimized = "658327ea-f89d-4fab-a63d-7e88639e58f6";
      };
      # AWS managed origin request policy
      managed-origin-request-policy = {
        # ID for policy CORS-S3Origin 
        cors-s3-origin = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf";
      };
    in {
      allowed_methods = ["DELETE" "GET" "HEAD" "OPTIONS" "PATCH" "POST" "PUT"];
      cached_methods = ["GET" "HEAD"];
      target_origin_id = "$\{aws_s3_bucket.media_storage.id}.s3.$\{aws_s3_bucket.media_storage.region}.amazonaws.com";
      viewer_protocol_policy = "redirect-to-https";
      cache_policy_id = managed-cache-policy.caching-optimized;
      origin_request_policy_id = managed-origin-request-policy.cors-s3-origin;
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
    price_class = "PriceClass_All";
  };
};
  # Output the distribution URL for use in backend logic
  config.output.cloudfront_distro_url = {
    value = "\${aws_cloudfront_distribution.media_distribution.domain_name}";
  };
}
