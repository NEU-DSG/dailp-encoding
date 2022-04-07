{ hostName, primaryAddress, secondary0Address ? null, secondary1Address ? null
, ... }:
let
  nixpkgs = let rev = "cd63096d6d887d689543a0b97743d28995bc9bc3";
  in builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/${rev}.tar.gz";
    sha256 = "1wg61h4gndm3vcprdcg7rc4s1v3jkm5xd7lw8r2f67w502y94gcy";
  };
in import "${nixpkgs}/nixos" {
  system = "x86_64-linux";

  configuration = { config, pkgs, ... }: {
    imports = [ "${nixpkgs}/nixos/modules/virtualisation/amazon-image.nix" ];

    nix = {
      binaryCaches =
        [ "https://cache.nixos.org" "https://hercules-ci.cachix.org" ];
      binaryCachePublicKeys = [
        "hercules-ci.cachix.org-1:ZZeDl9Va+xe9j+KqdzoBZMFJHVQ42Uu/c/1/KMC5Lw0="
      ];
    };

    ec2.hvm = true;
    networking.hostName = hostName;

    services.hercules-ci-agent.enable = true;
    services.hercules-ci-agent.concurrentTasks = 4;

    # The NixOS module has to be conservative with system-level settings,
    # because they potentially affect other services.
    # The hercules_ci_agent_nixos module does not have this design goal,
    # so it can patch Nix automatically if necessary.
    services.hercules-ci-agent.patchNix = true;

    systemd.services.install-secrets = {
      enable = true;
      before = [ "hercules-ci-agent.service" ];
      wantedBy = [ "hercules-ci-agent.service" ];
      script = ''
        install --directory \
                --owner hercules-ci-agent \
                --group nogroup \
                --mode 0700 \
                /var/lib/hercules-ci-agent/secrets \
                ;
        install --mode 0400 \
                --owner hercules-ci-agent \
                /var/keys/cluster_join_token \
                /var/lib/hercules-ci-agent/secrets/cluster-join-token.key \
                ;
        install --mode 0400 \
                --owner hercules-ci-agent \
                /var/keys/binary_caches_json \
                /var/lib/hercules-ci-agent/secrets/binary-caches.json \
                ;
      '';
      serviceConfig.Type = "oneshot";
    };

    environment.systemPackages = [ pkgs.cloud-utils ];

    # Limit journal size
    services.journald.extraConfig = ''
      SystemMaxUse=1024M
    '';
  };
}
