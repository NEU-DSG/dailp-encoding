# Outputs for the data backup and data resilience workflow

output "bucket_name" {
  description = "Return name of the S3 bucket specific to this environment."
  value = local.bucket_name
}

output "bucket_arn" {
  description = "ARN of the backup S3 bucket which is needed to grant access."
  value = aws_s3_bucket.backups.arn
}
