{ config, lib, pkgs, ... }:
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  config.import = [
    {
      to = "module.bastion_host.aws_iam_role.default[0]";
      id = "${prefixName "bastion"}";
    }
    {
      to = "module.bastion_host.aws_iam_role_policy.main[0]";
      id = "${prefixName "bastion"}:${prefixName "bastion"}";
    }
    {
      to = "module.bastion_host.aws_instance.default";
      id = "i-0e4166c8cb6363bb3"; # TODO update value later. 
    }
  ];
}