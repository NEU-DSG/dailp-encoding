terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

variable "name"   { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = set(string) }
variable "client_cidrs"       { type = set(string) }
variable "certificate_arn"    { type = string }
variable "database_security_group" { type = string }

locals {
  container_port = 8080
}


resource "aws_security_group" "task" {
  name_prefix = "${var.name}-task-"
  description = "GraphQL API Fargate tasks"
  vpc_id      = var.vpc_id
}


resource "aws_security_group" "alb" {
  name_prefix = "${var.name}-alb-"
  description = "Internal GraphQL load balancer"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_egress_rule" "alb_to_task" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.task.id
  ip_protocol                  = "tcp"
  from_port                    = local.container_port
  to_port                      = local.container_port
}

resource "aws_vpc_security_group_ingress_rule" "task_from_alb" {
  security_group_id            = aws_security_group.task.id
  referenced_security_group_id = aws_security_group.alb.id
  ip_protocol                  = "tcp"
  from_port                    = local.container_port
  to_port                      = local.container_port
}

resource "aws_vpc_security_group_egress_rule" "task_to_database" {
  security_group_id            = aws_security_group.task.id
  referenced_security_group_id = var.database_security_group
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}

resource "aws_vpc_security_group_egress_rule" "task_https" {
  security_group_id = aws_security_group.task.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_lb" "graphql" {
  name               = var.name
  internal           = true
  load_balancer_type = "application"
  subnets            = var.private_subnet_ids
  security_groups    = [aws_security_group.alb.id]
}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  for_each = var.client_cidrs

  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.graphql.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.graphql.arn
  }
}

resource "aws_lb_target_group" "graphql" {
  name_prefix = "gql-"
  vpc_id      = var.vpc_id
  target_type = "ip"
  protocol    = "HTTP"
  port        = local.container_port

  health_check {
    path    = "/healthz"
    matcher = "200"
  }
}

output "task_security_group_id" {
  value = aws_security_group.task.id
}
