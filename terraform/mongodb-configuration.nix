# Hermetic NixOS configuration for an AWS EC2 instance that
# uses nixpkgs pinned to a specific Git revision with an integrity
# hash to ensure that we construct a NixOS system as purely as
# possible.
#
# The primary benefit of this is that it removes deployment surprises
# when other developers supply a different nix-channel in the NIX_PATH
# of their environment (even if you only add the 20.09 channel,
# nix-channel --update can mutate that channel to a 20.09 with
# backported changes).
#
# The secondary benefit is that you guard the `nixpkgs` you use, with
# an integrity hash.
{ primaryAddress, secondaryAddresses ? null, ... }:
let
  nixpkgs = let
    rev = "cd63096d6d887d689543a0b97743d28995bc9bc3";
    sha256 = "1wg61h4gndm3vcprdcg7rc4s1v3jkm5xd7lw8r2f67w502y94gcy";
  in builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/${rev}.tar.gz";
    inherit sha256;
  };

  system = "x86_64-linux";

  configuration = { config, pkgs, ... }: {
    imports = [ "${nixpkgs}/nixos/modules/virtualisation/amazon-image.nix" ];

    ec2.hvm = true;

    # Only allow SSH and certain MongoDB ports.
    networking.firewall.allowedTCPPorts = [ 22 27017 27030 ];

    environment.systemPackages = [ pkgs.cloud-utils ];

    # Required because MongoDB 4.2 has an unfree license, SSPL.
    nixpkgs.config.allowUnfree = true;
    services.mongodb = let replSetName = "rs0";
    in {
      enable = true;
      package = pkgs.mongodb-4_2;
      inherit replSetName;
      # Bind to all IPs, since we restrict access on the security group and
      # network interface already. This allows the EC2 instance to have multiple addresses.
      bind_ip = "::,0.0.0.0";
      dbpath = "/data";
      extraConfig = ''
        storage.journal.enabled: true
      '';
      enableAuth = false;
    };

    systemd.services.mongodb-replication = if secondaryAddresses == null then {
      enable = false;
    } else {
      enable = true;
      wantedBy = [ "mongodb.service" ];
      restartIfChanged = true;
      script = let
        port = "27017";
        addressMembers = pkgs.lib.imap1 (i: addr:
          "{_id: ${builtins.toString i}, host: '${addr}:${port}', priority: 5}")
          secondaryAddresses;
        allMembers =
          [ "{_id: 0, host: '${primaryAddress}:${port}', priority: 10}" ]
          ++ addressMembers;
        addressesStr = pkgs.lib.concatStringsSep "," allMembers;
        replSetName = config.services.mongodb.replSetName;
        f = pkgs.writeTextFile {
          name =
            "replica-set-script-${builtins.hashString "sha1" addressesStr}";
          text = ''
            if (rs.status().ok) {
              rs.reconfig({_id: "${replSetName}", members: [${addressesStr}]}, {force: true});
            } else {
              rs.initiate({_id: "${replSetName}", members: [${addressesStr}]});
            }
          '';
          executable = false;
          destination = "/script.txt";
        };
      in ''
        ${config.services.mongodb.package}/bin/mongo admin "${f}/script.txt"
      '';
      # Retry several times if necessary.
      serviceConfig = {
        Restart = "on-failure";
        RestartSec = "2s";
      };
      unitConfig = {
        StartLimitBurst = 5;
        StartLimitIntervalSec = 2000;
      };
    };

    systemd.services.mongodb.after = [ "mongodb-ownership.service" ];

    # Make sure that the mongodb user owns all of its data.
    # This should prevent issues with mounting a freshly created EBS volume.
    systemd.services.mongodb-ownership = {
      wantedBy = [ "data.mount" "journal.mount" ];
      after = [ "data.mount" "journal.mount" ];
      script = ''
        chown -R mongodb /data
        chown -R mongodb /data/journal
      '';
      # Retry several times if necessary.
      serviceConfig = {
        Restart = "on-failure";
        RestartSec = "1s";
      };
      unitConfig = {
        StartLimitBurst = 10;
        StartLimitIntervalSec = 100;
      };
    };

    # Mount all three volumes with the same settings.
    fileSystems = let
      fsType = "xfs";
      options = [ "defaults" "auto" "noatime" "noexec" ];
      autoFormat = true;
    in {
      "/data" = {
        inherit fsType options autoFormat;
        device = "/dev/xvdf";
      };
      "/data/journal" = {
        inherit fsType options autoFormat;
        device = "/dev/xvdg";
      };
    };

    # Limit journal size
    services.journald.extraConfig = ''
      SystemMaxUse=1024M
    '';
  };

in import "${nixpkgs}/nixos" { inherit system configuration; }
