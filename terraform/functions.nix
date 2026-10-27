{ config, lib, pkgs, ... }:
let
  inherit (builtins) toJSON hashFile hashString map;
  inherit (lib) mkMerge attrValues zipAttrs mkOption;
  api = "functions_api";
in {
  imports = [ ./functions-base.nix ];
  options.functions = with lib.types; {
    bucket = mkOption { type = str; };
    security_group_ids = mkOption { type = listOf str; };
    package_path = mkOption { type = str; };
    functions = mkOption { type = listOf attrs; };
    tags = mkOption {
      type = attrsOf str;
      default = { };
    };
  };

  # Allow CORS on all defined endpoints.
  config.module = mkMerge (map (fun:
    zipAttrs (map (endpoint: {
      "${endpoint.id}_cors" = {
        source = "mewa/apigateway-cors/aws";
        version = "2.0.1";

        api = "\${aws_api_gateway_rest_api.${api}.id}";
        resource = "\${aws_api_gateway_resource.${endpoint.id}.id}";

        methods = [ "POST" "GET" ];
        # Allow any headers for best compatibility with GraphQL clients.
        headers = [ "*" ];
        discard_default_headers = true;
      };
    }) fun.endpoints)) config.functions.functions);
}
