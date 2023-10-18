{ config, lib, pkgs, ... }:
let 
  stage = config.setup.stage ;
in {
  prefixName = base: "dailp-${stage}-${base}";
}
