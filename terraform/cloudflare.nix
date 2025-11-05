{ config, lib, pkgs, ... }: {
config.resource = {
  cloudflare_turnstile_widget.main = {
    account_id = getEnv "CLOUDFLARE_ACCOUNT_ID";
    name = "general turnstile widget";
    domains = [ "dailp.northeastern.edu" ];
    mode= "managed";
    region = "world";
  }
}