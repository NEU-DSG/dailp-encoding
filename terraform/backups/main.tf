# Using aws Terraform
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# Bucket name string 
locals {
  bucket_name = "dailp-${var.env_prefix}-backups"
}

# Bucket creation
resource "aws_s3_bucket" "backups" {
  bucket = local.bucket_name

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = local.bucket_name
    Environment = var.env_prefix
    Purpose = "backups for more restrictive access"
  }
}

# Should prevent bucket access from being publicly fetched
resource "aws_s3_bucket_public_access_block" "backups" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

# Allows bucket perms to be determined as opposed to using defualts
resource "aws_s3_bucket_ownership_controls" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Prevents overwriting bad and stale data to backups
resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration {
    status = "Enabled"
  }
}
