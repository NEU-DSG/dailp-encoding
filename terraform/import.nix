{ config, lib, pkgs, ... }:
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
  config.import = [
    {
      to = "aws_iam_role.default";
      id = prefixName "bastion";
    }
    {
      to = "aws_iam_role_policy.main";
      id = "${prefixName "bastion"}:${prefixName "bastion"}";
    }
  ];
}