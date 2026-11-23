terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    key          = "ecs/staging/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }
}

variable "staging" {
  type = object({
    account_id                = string
    vpc_id                    = string
    private_subnet_ids        = set(string)
    client_cidrs              = set(string)
    certificate_arn           = string
    database_security_group   = string
    database_url_secret_arn   = string
  })
}

provider "aws" {
  region              = "us-east-1"
  allowed_account_ids = [var.staging.account_id]
}

variable "image" {
  description = "GraphQL release image in ECR, pinned by digest."
  type        = string
}

variable "desired_count" {
  description = "Number of staging Fargate tasks to run."
  type        = number
  default     = 1
}

module "graphql-api" {
  source = "../../modules/graphql-api"
  name = "dailp-graphql-staging"
  stage = "staging"

  vpc_id = var.staging.vpc_id
  private_subnet_ids = var.staging.private_subnet_ids
  client_cidrs = var.staging.client_cidrs
  certificate_arn = var.staging.certificate_arn
  database_security_group = var.staging.database_security_group
  database_url_secret_arn = var.staging.database_url_secret_arn

  image = var.image
  desired_count = var.desired_count
}

output "task_security_group_id" {
  value = module.graphql-api.task_security_group_id
}
