{ config, lib, pkgs, ... }:

let
  inherit (builtins) map filter getEnv replaceStrings toJSON;
  inherit (lib) mkMerge concatStringsSep;
  terraform_nixos_repo =
    "https://github.com/loafofpiecrust/terraform-nixos.git";
  terraform_nixos_ref = "d91078b61181df76d78b0594b5cd1fa76ebae7f7";
  toKebabCase = s: replaceStrings [ "_" ] [ "-" ] s;
in {
  options.servers.mongodb = with lib;
    with types; {
      instance_type = mkOption {
        type = str;
        default = "t3.small";
      };
      volume_size = mkOption {
        type = int;
        # This value can always increase, but never decrease.
        default = 32;
      };
      iops = mkOption {
        type = int;
        default = 1000;
      };
      nodes = mkOption {
        type = listOf attrs;
        default = [ ];
      };
    };

  config.resource = let
    mkAttachedVolume = (volume: {
      aws_ebs_volume."${volume.name}" = {
        availability_zone = volume.zone;
        encrypted = true;
        type = volume.type;
        size = volume.size;
        iops = if volume.type == "io2" || volume.type == "io1" then
          volume.iops
        else
          null;
        tags = { Name = "dailp-${toKebabCase volume.name}"; };
      };

      aws_volume_attachment."${volume.name}" = {
        device_name = volume.device;
        volume_id = "\${aws_ebs_volume.${volume.name}.id}";
        instance_id = volume.instance_id;
      };
    });
    mkNode =
      (node@{ name, subnet_id, availability_zone, root_volume_size ? 16, ... }:
        mkMerge [
          {
            aws_instance."${name}" = {
              ami = "\${module.nixos_image.ami}";
              instance_type = config.servers.mongodb.instance_type;
              availability_zone = availability_zone;
              network_interface = {
                network_interface_id = "\${aws_network_interface.${name}.id}";
                device_index = 0;
              };
              key_name = "dailp-deployment-terraform";
              iam_instance_profile = "\${aws_iam_instance_profile.${name}.id}";
              root_block_device = {
                volume_size = root_volume_size;
                volume_type = "gp3";
              };
              tags = { Name = "dailp-${toKebabCase name}"; };
            };

            aws_iam_instance_profile."${name}" = {
              path = "/";
              role = "\${aws_iam_role.mongodb_node.id}";
            };

            aws_network_interface."${name}" = {
              inherit subnet_id;
              description = "Network interface for ${toKebabCase name}";
              security_groups = [ "\${aws_security_group.nixos_test.id}" ];
              source_dest_check = true;
              tags = {
                Network = "Public";
                Name = "dailp-${toKebabCase name}";
              };
            };
          }
          (mkAttachedVolume {
            name = "${node.name}_data";
            type = "gp3";
            device = "/dev/xvdf";
            size = config.servers.mongodb.volume_size;
            iops = config.servers.mongodb.iops;
            zone = node.availability_zone;
            instance_id = "\${aws_instance.${node.name}.id}";
          })
          (mkAttachedVolume {
            name = "${node.name}_journal";
            type = "gp3";
            device = "/dev/xvdg";
            size = 25;
            iops = 250;
            zone = node.availability_zone;
            instance_id = "\${aws_instance.${node.name}.id}";
          })
        ]);
  in mkMerge [
    {
      aws_security_group.nixos_test = {
        name = "dailp-nixos-test";
        vpc_id = config.setup.vpc;
        description = "MongoDB on NixOS test";
        # GitHub Actions relies on the ID staying the same.
        lifecycle.prevent_destroy = true;
      };

      aws_security_group_rule.mongodb_internet = {
        type = "egress";
        security_group_id = "\${aws_security_group.nixos_test.id}";
        description = "All egress";
        protocol = "-1";
        from_port = 0;
        to_port = 0;
        cidr_blocks = [ "0.0.0.0/0" ];
        ipv6_cidr_blocks = [ "::/0" ];
      };

      aws_security_group_rule.mongodb_ssh = {
        type = "ingress";
        security_group_id = "\${aws_security_group.nixos_test.id}";
        description = "SSH access";
        protocol = "tcp";
        from_port = 22;
        to_port = 22;
        cidr_blocks = [ "129.10.0.0/16" "68.160.191.121/32" ];
      };

      aws_security_group_rule.mongodb_external = {
        type = "ingress";
        security_group_id = "\${aws_security_group.nixos_test.id}";
        source_security_group_id = "\${aws_security_group.mongodb_access.id}";
        description = "MongoDB external access";
        protocol = "tcp";
        from_port = 27017;
        to_port = 27017;
      };

      aws_security_group_rule.mongodb_internal = {
        type = "ingress";
        security_group_id = "\${aws_security_group.nixos_test.id}";
        description = "MongoDB internal access";
        protocol = "tcp";
        from_port = 27017;
        to_port = 27017;
        self = true;
      };

      aws_security_group.mongodb_access = {
        name = "dailp-mongodb-access";
        vpc_id = config.setup.vpc;
        description = "Access DAILP MongoDB servers";
        ingress = [ ];
        egress = [{
          description = "All egress";
          from_port = 0;
          to_port = 0;
          protocol = "-1";
          cidr_blocks = [ "0.0.0.0/0" ];
          ipv6_cidr_blocks = [ "::/0" ];
          self = false;
          security_groups = [ ];
          prefix_list_ids = [ ];
        }];
      };

      aws_iam_role.mongodb_node = {
        name = "dailp-mongodb-node";
        managed_policy_arns = [
          "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
        ];
        assume_role_policy = toJSON {
          Version = "2012-10-17";
          Statement = [{
            Action = "sts:AssumeRole";
            Principal = { Service = "ec2.amazonaws.com"; };
            Effect = "Allow";
            Sid = "";
          }];
        };
        path = "/";
        inline_policy = {
          name = "dailp-mongodb-access-policy";
          policy = toJSON {
            Statement = [{
              Effect = "Allow";
              Action = [
                "ec2:Describe*"
                "ec2:AttachNetworkInterface"
                "ec2:AttachVolume"
                "ec2:DetachVolume"
                "ec2:CreateTags"
                "ec2:CreateVolume"
                "ec2:RunInstances"
                "ec2:StartInstances"
                "ec2:DeleteVolume"
                "ec2:CreateSecurityGroup"
                "ec2:CreateSnapshot"
              ];
              Resource = "*";
            }];
          };
        };
      };
    }
    (mkMerge (map mkNode config.servers.mongodb.nodes))
  ];

  config.module = mkMerge [
    {
      nixos_image = {
        source =
          "git::${terraform_nixos_repo}//aws_image_nixos?ref=${terraform_nixos_ref}";
        release = "20.09";
      };
    }
    (mkMerge (map (node@{ name, ... }: {
      "deploy_${name}" = {
        source =
          "git::${terraform_nixos_repo}//deploy_nixos?ref=${terraform_nixos_ref}";
        nixos_config = toString ./mongodb-configuration.nix;
        hermetic = true;
        target_user = "root";
        target_host = "\${aws_instance.${name}.public_ip}";
        ssh_agent = false;
        ssh_private_key = getEnv "AWS_SSH_KEY";
        extra_eval_args = let
          primaryIp = "\${aws_instance.${name}.public_dns}";
          secondaryAddrs =
            map (node: "\${aws_instance.${node.name}.public_dns}")
            (filter (node: node.primary == false) config.servers.mongodb.nodes);
          secondariesQuoted = map (s: ''"${s}"'') secondaryAddrs;
          secondariesStr = concatStringsSep " " secondariesQuoted;
          secondaries = if node.primary then "[${secondariesStr}]" else "null";
        in [
          # HACK: Force the deployment to wait for all volumes to be attached
          # first. This helps prevent wonky MongoDB logging errors.
          "--argstr"
          "junk"
          "\${aws_volume_attachment.${name}_data.id} \${aws_volume_attachment.${name}_journal.id}"
          "--arg"
          "configArgs"
          ''
            { primaryAddress = "${primaryIp}"; secondaryAddresses = ${secondaries}; }''
        ];
      };
    }) config.servers.mongodb.nodes))
  ];
}
