{
  inputs = {
    pkgs.url = "github:nixos/nixpkgs/nixos-23.11";
    utils.url = "github:numtide/flake-utils";
    # Provides cargo dependencies.
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "pkgs";
    };
    # Builds rust projects.
    naersk = {
      url = "github:nmattia/naersk";
      inputs.nixpkgs.follows = "pkgs";
    };
    nix-filter.url = "github:numtide/nix-filter";
    terranix = {
      url = "github:terranix/terranix";
      inputs.nixpkgs.follows = "pkgs";
    };

  };

  outputs = inputs:
    inputs.utils.lib.eachDefaultSystem (system:
      let
        pkgs = import inputs.pkgs {
          inherit system;
          config.allowUnfree = true;
        };
        fenix = inputs.fenix.packages.${system};
        toolchainFile = {
          file = ./rust-toolchain.toml;
          sha256 = "sha256-SDu4snEWjuZU475PERvu+iO50Mi39KVjqCeJeNvpguU=";
        };
        rust-toolchain = fenix.fromToolchainFile toolchainFile;
        naersk = inputs.naersk.lib.${system}.override {
          cargo = rust-toolchain;
          rustc = rust-toolchain;
        };
        filter = inputs.nix-filter.lib;
        packageSrc = filter.filter {
          root = ./.;
          include = [
            (filter.inDirectory ".cargo")
            (filter.inDirectory "types")
            (filter.inDirectory "graphql")
            (filter.inDirectory "migration")
            ./Cargo.toml
            ./Cargo.lock
            ./rust-toolchain.toml
            ./sqlx-data.json
          ];
        };
        # The rust compiler is internally a cross compiler, so a single
        # toolchain can be used to compile multiple targets. In a hermetic
        # build system like nix flakes, there's effectively one package for
        # every permutation of the supported hosts and targets.
        targetPackage = let
          target = "x86_64-unknown-linux-musl";
          pkgsCross = import inputs.pkgs {
            inherit system;
            crossSystem.config = target;
          };
          cc = pkgsCross.pkgsStatic.stdenv.cc;
        in naersk.buildPackage {
          root = ./.;
          src = packageSrc;
          doCheck = true;
          doTest = true;

          nativeBuildInputs = [ cc ];

          # Configures the target which will be built.
          # ref: https://doc.rust-lang.org/cargo/reference/config.html#buildtarget
          CARGO_BUILD_TARGET = target;
          TARGET_CC = "${cc}/bin/${target}-gcc";
          CARGO_BUILD_RUSTFLAGS = "-C target-feature=+crt-static";
        };
        hostPackage = naersk.buildPackage {
          root = ./.;
          src = packageSrc;
        };
        dailpFunctions = with pkgs;
          stdenv.mkDerivation {
            name = "dailp-functions";
            buildInputs = [ zip ];
            # Permits a derivation with no source files.
            unpackPhase = "true";
            installPhase = ''
              mkdir -p $out
              cp -f ${targetPackage}/bin/dailp-graphql $out/bootstrap
              zip -j $out/dailp-graphql.zip $out/bootstrap
              cp -f ${targetPackage}/bin/dailp-outbound $out/bootstrap
              zip -j $out/dailp-outbound.zip $out/bootstrap
            '';
          };
        terraformConfig = inputs.terranix.lib.terranixConfiguration {
          inherit system;
          modules = [{imports = [./terraform/main.nix]; functions.package_path = "${dailpFunctions}";}];
          strip_nulls = true;
        };
        # terraformConfig = pkgs.writeTextFile {
        #   name = "terraform-config";
        #   text = let
        #     tf = inputs.terranix.lib.terranixConfiguration {
        #       inherit system;
        #       modules = [{imports = [./terraform/main.nix]; functions.package_path = "/";}];
        #       strip_nulls = true;
        #     };
        #   in builtins.toJSON (tf);
        #   executable = false;
        #   destination = "/config.tf.json";
        # };
        mkBashApp = name: script:
          inputs.utils.lib.mkApp {
            drv = pkgs.writers.writeBashBin name script;
            exePath = "/bin/${name}";
          };
        tf = "${pkgs.terraform}/bin/terraform";
        inherit (builtins) getEnv;
        tfInit = ''
          cp -f ${terraformConfig} ./config.tf.json
          export AWS_ACCESS_KEY_ID=${getEnv "AWS_ACCESS_KEY_ID"}
          export AWS_SECRET_ACCESS_KEY=${getEnv "AWS_SECRET_ACCESS_KEY"}
          export TF_DATA_DIR=$(pwd)/.terraform
          ${tf} init -upgrade
        '';
        # The bastion has no public IP and no open SSH ingress rule, so both
        # of these tunnel SSH over an SSM Session Manager port-forwarding
        # session instead of connecting directly.
        #
        # Requires:
        #   BASTION_ID      - the bastion's EC2 instance id
        #                     (e.g. `nix run --impure .#tf-output bastion_id`)
        #   BASTION_SSH_KEY - path to the local `dailp-dev-2024` private key
        bastionTunnel = ''
          echo "Opening SSM tunnel to $BASTION_ID on local port $local_port..."
          aws ssm start-session \
            --target "$BASTION_ID" \
            --document-name AWS-StartPortForwardingSession \
            --parameters "{\"portNumber\":[\"22\"],\"localPortNumber\":[\"$local_port\"]}" &
          ssm_pid=$!
          trap 'kill $ssm_pid 2>/dev/null' EXIT

          echo "Waiting for tunnel to come up..."
          for _ in $(seq 1 10); do
            if (exec 3<>"/dev/tcp/localhost/$local_port") 2>/dev/null; then
              exec 3<&-
              exec 3>&-
              break
            fi
            sleep 1
          done
        '';
        # Copies a local file or directory onto the dev bastion host.
        #
        # Usage: copy-to-bastion <local-path> [remote-path]
        # `remote-path` defaults to the ec2-user home directory.
        copyToBastionScript = ''
          set -euo pipefail

          if [ $# -lt 1 ]; then
            echo "Usage: copy-to-bastion <local-path> [remote-path]" >&2
            exit 1
          fi

          : "''${BASTION_ID:?Set BASTION_ID to the target EC2 instance id}"
          : "''${BASTION_SSH_KEY:?Set BASTION_SSH_KEY to the path of the dailp-dev-2024 private key}"

          local_path="$1"
          ssh_user="''${BASTION_SSH_USER:-ec2-user}"
          remote_path="''${2:-/home/$ssh_user/}"
          local_port="''${BASTION_LOCAL_PORT:-2222}"

          ${bastionTunnel}

          echo "Copying $local_path to $ssh_user@localhost:$remote_path via port $local_port..."
          scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
            -P "$local_port" -i "$BASTION_SSH_KEY" -r "$local_path" "$ssh_user@localhost:$remote_path"

          echo "Done."
        '';
        # Runs a command on the dev bastion host over the same kind of SSM
        # tunnel as copy-to-bastion.
        #
        # Usage: run-on-bastion <remote-command>
        runOnBastionScript = ''
          set -euo pipefail

          if [ $# -lt 1 ]; then
            echo "Usage: run-on-bastion <remote-command>" >&2
            exit 1
          fi

          : "''${BASTION_ID:?Set BASTION_ID to the target EC2 instance id}"
          : "''${BASTION_SSH_KEY:?Set BASTION_SSH_KEY to the path of the dailp-dev-2024 private key}"

          ssh_user="''${BASTION_SSH_USER:-ec2-user}"
          local_port="''${BASTION_LOCAL_PORT:-2222}"

          ${bastionTunnel}

          echo "Running command on $ssh_user@localhost via port $local_port..."
          ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
            -p "$local_port" -i "$BASTION_SSH_KEY" "$ssh_user@localhost" -- "$@"
        '';
      in rec {
        # Add extra binary caches for quicker builds of the rust toolchain
        nixConfig = {
          binaryCaches =
            [ "https://nix-community.cachix.org" "https://dailp.cachix.org" ];
          binaryCachePublicKeys = [
            "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
            "dailp.cachix.org-1:QKIYFfTB/jrD6J8wZoBEpML64ONrIxs3X5ifSKoJ3kA="
          ];
        };

        packages.default = terraformConfig;

        apps.migrate-data = inputs.utils.lib.mkApp {
          drv = hostPackage;
          exePath = "/bin/dailp-migration";
        };

        apps.migrate-to-xml = inputs.utils.lib.mkApp {
          drv = hostPackage;
          exePath = "/bin/migrate-to-xml";
        };

        apps.copy-to-bastion = mkBashApp "copy-to-bastion" copyToBastionScript;

        apps.run-on-bastion = mkBashApp "run-on-bastion" runOnBastionScript;

        apps.migrate-schema = mkBashApp "migrate-schema" ''
          cd types
          ${pkgs.sqlx-cli}/bin/sqlx database create
          ${pkgs.sqlx-cli}/bin/sqlx migrate run
        '';

        apps.tf-init = mkBashApp "tf-init" tfInit;

        apps.tf-plan = mkBashApp "plan" ''
          ${tfInit}
          ${tf} plan
        '';

        apps.tf-apply = mkBashApp "apply" ''
          ${tfInit}
          ${tf} apply
        '';

        apps.tf-apply-now = mkBashApp "apply-now" ''
          ${tfInit}
          ${tf} apply -auto-approve
        '';

        apps.tf-output = mkBashApp "tf-output" ''
          ${tf} output $1 | xargs
        '';

        devShells.default = with pkgs;
          mkShell rec {
            name = "dailp-dev";
            unpackPhase = "true";
            RUST_LOG = "info";
            LD_LIBRARY_PATH = "${lib.makeLibraryPath buildInputs}";
            shellHook = ''
              export PROJECT_ROOT=$PWD
              export PGDATA=$PROJECT_ROOT/.postgres
              git config --local core.hooksPath $PROJECT_ROOT/.git-hooks
              eval $(${direnv}/bin/direnv dotenv)
            '';
            buildInputs = [
              autoconf
              automake
              libtool
              pkg-config
              file
              nasm
              terraform
              rust-toolchain
              nodejs-18_x
              yarn
              act
              postgresql_14
              sqlx-cli
              sqlfluff
              bash
              shellcheck
              awscli2
              curl
              (writers.writeBashBin "dev-check" ./check.sh)
              (writers.writeBashBin "dev-database" ''
                export DATABASE_URL=postgres://localhost:5432/dailp
                [ ! -d "$PGDATA" ] && initdb
                postgres -D $PGDATA -c unix_socket_directories=/tmp
              '')
              (writers.writeBashBin "dev-graphql" ''
                cd $PROJECT_ROOT
                cargo run --bin dailp-graphql-schema
                cargo run --bin dailp-graphql-local
              '')
              (writers.writeBashBin "dev-website" ''
                cd $PROJECT_ROOT/website
                yarn install
                yarn dev
              '')
              (writers.writeBashBin "dev-migrate-schema" ''
                cd $PROJECT_ROOT/types
                sqlx database create
                sqlx migrate run
              '')
              (writers.writeBashBin "dev-migrate-data" ''
                cd $PROJECT_ROOT
                cargo run --bin dailp-migration
              '')
              (writers.writeBashBin "dev-generate-types" ''
                cd $PROJECT_ROOT/types
                cargo sqlx prepare -- -p dailp
              '')
              (writers.writeBashBin "dev-pg-dump" ''
                export DATABASE_URL=postgres://localhost:5432/dailp
                $PROJECT_ROOT/scripts/src/pg_dump_backup.sh
                echo "See output in ./backups/pg_dump/"
              '')
              (writers.writeBashBin "dev-csv-dump" ''
                export DATABASE_URL=postgres://localhost:5432/dailp
                $PROJECT_ROOT/scripts/src/export_db_to_csv.sh
              '')
              (writers.writeBashBin "mock-database" ''
                DATABASE_URL=postgres://localhost:5432/test
                if [[ -n `psql -Atqc '\list test' postgres` ]]; then
                  echo "Found leftover test database. Cleaning up..."
                  dropdb test -f
                fi
                createdb test
                dev-migrate-schema
              '')
              (writers.writeBashBin "dev-csv-restore" ''
                $PROJECT_ROOT/scripts/src/import_db_from_csv.sh $@
              '')
              (writers.writeBashBin "dev-pg-restore" ''
                $PROJECT_ROOT/scripts/src/pg_restore_backup.sh $@
              '')
            ] ++ lib.optionals stdenv.isDarwin [
              darwin.apple_sdk.frameworks.Security
              darwin.apple_sdk.frameworks.SystemConfiguration
              libiconv
            ];
          };
      });
}
