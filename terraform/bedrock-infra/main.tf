terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "dailp-main" {
  cidr_block = "192.168.0.0/20"
}

resource "aws_subnet" primary {
  vpc_id = aws_vpc.dailp-main.id
  cidr_block = "192.168.0.0/22"
}
resource "aws_subnet" secondary {
  vpc_id = aws_vpc.dailp-main.id
  cidr_block = "192.168.4.0/22"
}
resource "aws_subnet" tertiary {
  vpc_id = aws_vpc.dailp-main.id
  cidr_block = "192.168.8.0/22"
}
resource "aws_subnet" bastion {
  vpc_id = aws_vpc.dailp-main.id
  cidr_block = "192.168.12.0/22"
}

output "aws_vpc_id" {
  value = aws_vpc.dailp-main.id
}

output "primary_subnet_id" {
  value = aws_subnet.primary.id
}
output "secondary_subnet_id" {
  value = aws_subnet.secondary.id
}
output "tertiary_subnet_id" {
  value = aws_subnet.tertiary.id
}
output "bastion_subnet_id" {
  value = aws_subnet.bastion.id
}
