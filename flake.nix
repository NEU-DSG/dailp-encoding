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
          sha256 = "sha256-Q9UgzzvxLi4x9aWUJTn+/5EXekC98ODRU1TwhUs9RnY=";
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
            (filter.inDirectory "admin-event-handlers")
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
              cp -f ${targetPackage}/bin/auth-post-confirmation $out/bootstrap
              zip -j $out/auth-post-confirmation.zip $out/bootstrap
            '';
          };
        terraformConfig = pkgs.writeTextFile {
          name = "terraform-config";
          text = let
            tf = import "${pkgs.terranix}/core/default.nix" {
              inherit pkgs;
              terranix_config = {
                imports = [ ./terraform/main.nix ];
                functions.package_path = "${dailpFunctions}";
              };
              strip_nulls = true;
            };
          in builtins.toJSON (tf.config);
          executable = false;
          destination = "/config.tf.json";
        };
        mkBashApp = name: script:
          inputs.utils.lib.mkApp {
            drv = pkgs.writers.writeBashBin name script;
            exePath = "/bin/${name}";
          };
        tf = "${pkgs.terraform}/bin/terraform";
        inherit (builtins) getEnv;
        tfInit = ''
          cp -f ${terraformConfig}/config.tf.json ./
          export AWS_ACCESS_KEY_ID=${getEnv "AWS_ACCESS_KEY_ID"}
          export AWS_SECRET_ACCESS_KEY=${getEnv "AWS_SECRET_ACCESS_KEY"}
          export TF_DATA_DIR=$(pwd)/.terraform
          ${tf} init -upgrade
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

        apps.validate-data = inputs.utils.lib.mkApp {
          drv = hostPackage;
          exePath = "/bin/dailp-validate";
        };

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
              (writers.writeBashBin "dev-check" ./check.sh)
              (writers.writeBashBin "dev-database" ''
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
                cd $PROJECT_ROOT
                cargo sqlx prepare --workspace -- -p dailp
              '')
            ] ++ lib.optionals stdenv.isDarwin [
              darwin.apple_sdk.frameworks.Security
              darwin.apple_sdk.frameworks.SystemConfiguration
              libiconv
            ];
          };
      });
}
