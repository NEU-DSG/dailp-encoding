variable "stage"                   { type = string }
variable "image"                   { type = string }
variable "database_url_secret_arn" { type = string }
variable "desired_count"           { type = number }

resource "aws_iam_role" "execution" {
  name_prefix = "${var.name}-exec-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "database_secret" {
  name = "read-database-url"
  role = aws_iam_role.execution.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "secretsmanager:GetSecretValue"
      Resource = var.database_url_secret_arn
    }]
  })
}

resource "aws_ecs_task_definition" "graphql" {
  family                   = var.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name      = "graphql"
    image     = var.image
    essential = true

    portMappings = [{
      containerPort = local.container_port
      protocol      = "tcp"
    }]

    environment = [{ name = "TF_STAGE", value = var.stage }]
    secrets     = [{ name = "DATABASE_URL", valueFrom = var.database_url_secret_arn }]
  }])
}

resource "aws_ecs_cluster" "graphql" {
  name = var.name
}

resource "aws_ecs_service" "graphql" {
  name            = var.name
  cluster         = aws_ecs_cluster.graphql.arn
  task_definition = aws_ecs_task_definition.graphql.arn
  launch_type     = "FARGATE"
  desired_count   = var.desired_count

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.graphql.arn
    container_name   = "graphql"
    container_port   = local.container_port
  }

  depends_on = [
    aws_lb_listener.https,
    aws_iam_role_policy_attachment.execution,
    aws_iam_role_policy.database_secret,
    aws_vpc_security_group_egress_rule.alb_to_task,
    aws_vpc_security_group_ingress_rule.task_from_alb,
    aws_vpc_security_group_egress_rule.task_to_database,
    aws_vpc_security_group_egress_rule.task_https,
  ]
}
