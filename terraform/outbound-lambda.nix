{ config, lib, pkgs, ... }:
let
  inherit (builtins) getEnv toJSON;
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  # Turnstile siteverify proxy. Deliberately has NO vpc_config: it runs in
  # the Lambda-managed network, which has direct outbound internet access,
  # so it can reach Cloudflare without a NAT gateway.
  resource.aws_lambda_function.outbound_turnstile = {
    lifecycle.prevent_destroy = false;
    lifecycle.create_before_destroy = true;
    function_name = prefixName "outbound-turnstile";
    filename = "${config.functions.package_path}/dailp-outbound.zip";
    runtime = "provided.al2";
    architectures = [ "x86_64" ];
    handler = "bootstrap";
    role = "\${aws_iam_role.lambda_exec.arn}";
    memory_size = 128;
    timeout = 30;
    publish = false;
    environment.variables = {
      TURNSTILE_SECRET_KEY = getEnv "TURNSTILE_SECRET_KEY";
    };
    tags = config.setup.global_tags // config.functions.tags;
  };

  # Let the graphql lambda (which runs as lambda_exec) invoke this function.
  resource.aws_iam_role_policy.invoke_outbound_turnstile = {
    name = "invoke-outbound-turnstile";
    role = "\${aws_iam_role.lambda_exec.id}";
    policy = toJSON {
      Version = "2012-10-17";
      Statement = [{
        Effect = "Allow";
        Action = "lambda:InvokeFunction";
        Resource = "\${aws_lambda_function.outbound_turnstile.arn}";
      }];
    };
  };
}

