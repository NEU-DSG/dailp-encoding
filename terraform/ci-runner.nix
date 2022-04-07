{ config, lib, pkgs, ... }:

let
  inherit (builtins) map filter getEnv replaceStrings toJSON toString;
  inherit (lib) mkMerge concatStringsSep imap0;
  terraform_nixos_repo = "https://github.com/tomferon/terraform-nixos.git";
  terraform_nixos_ref = "caa6191b952f8c92a097a67fc21200e2927e3d10";
  terraform_nixos =
    "git::${terraform_nixos_repo}//deploy_nixos?ref=${terraform_nixos_ref}";
in {
  options.servers.ci = with lib;
    with types; {
      subnet = mkOption { type = str; };
      availability_zone = mkOption { type = str; };
      instance_type = mkOption {
        type = str;
        default = "t3.small";
      };
      instance_tags = mkOption {
        type = attrsOf str;
        default = { };
      };
    };

  config.module = {
    deploy_ci_runner = {
      source = terraform_nixos;
      nixos_config = toString ./ci-configuration.nix;
      hermetic = true;
      target_user = "root";
      target_host = "\${aws_instance.ci_runner.public_ip}";
      ssh_agent = false;
      ssh_private_key = "\${var.aws_ssh_key}";
      arguments = {
        hostName = config.resource.aws_instance.ci_runner.tags.Name;
      };
      keys = {
        cluster_join_token = "\${var.cluster_join_token}";
        binary_caches_json = builtins.toJSON { };
      };
    };
  };

  config.resource = {
    aws_instance.ci_runner = {
      lifecycle.prevent_destroy = true;
      ami = "\${module.nixos_image.ami}";
      # We don't need many resources for CI.
      instance_type = config.servers.ci.instance_type;
      availability_zone = config.servers.ci.availability_zone;
      key_name = "dailp-deployment-terraform";
      # We only really need space for the nix store and caches.
      root_block_device = {
        volume_size = 16;
        volume_type = "gp3";
      };
      tags = {
        Name = "dailp-ci-runner";
      } // config.setup.global_tags // config.servers.ci.instance_tags;
      network_interface = {
        device_index = 0;
        network_interface_id = "\${aws_network_interface.ci_runner.id}";
      };
      iam_instance_profile = "\${aws_iam_instance_profile.ci_runner.id}";
    };

    aws_iam_instance_profile.ci_runner = {
      path = "/";
      # Use the MongoDB node role for now because it already configures VPC access.
      role = "\${aws_iam_role.mongodb_node}";
    };

    aws_network_interface.ci_runner = {
      subnet_id = config.servers.ci.subnet;
      description = "Network interface for DAILP CI/CD";
      # Grants SSH access under NEU VPN.
      security_groups = [ "\${aws_security_group.nixos_test.id}" ];
      source_dest_check = true;
      tags = {
        Network = "Public";
        Name = "dailp-ci-runner";
      };
    };
  };
}
