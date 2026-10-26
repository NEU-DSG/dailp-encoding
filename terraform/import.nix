{ config, lib, pkgs, ... }:
let 
  prefixName = base: "dailp${if (config.setup.stage == "prod") then "" else "-${config.setup.stage}"}-${base}"
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
      to = "module.bastion_host.aws_instance.default[0]";
      id = builtins.getEnv "BASTION_ID";
    }
  ];
}