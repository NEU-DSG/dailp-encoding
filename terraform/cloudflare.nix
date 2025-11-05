{ config, lib, pkgs, ... }: 
let 
  prefixName = import ./utils.nix { stage = config.setup.stage; };
in {
config.resource = {
  cloudflare_turnstile_widget.main = {
    account_id = getEnv "CLOUDFLARE_ACCOUNT_ID";
    name = "general turnstile widget";
    domains = [ "dailp.northeastern.edu" ];
    mode= "managed";
    region = "world";
  }
};
}