{ config, lib, pkgs, ... }:
{
  config.import = [
    {
      to = "module.bastion_host.aws_iam_role.default[0]";
      id = "dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-bastion";
    }
    {
      to = "module.bastion_host.aws_iam_role_policy.main[0]";
      id = "dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-bastion:dailp\${(local.stage == \"prod\") ? \"\" : \"-\${local.stage}\"}-bastion";
    }
    {
      to = "module.bastion_host.aws_instance.default[0]";
      id = "\${var.bastion_id}";
    }
  ];
}
