{
  inputs = {
    pkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    # Provides cargo dependencies.
    fenix = {
      url = "github:nix-community/fenix";
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
          sha256 = "6PfBjfCI9DaNRyGigEmuUP2pcamWsWGc4g7SNEHqD2c=";
        };
        rust-toolchain = fenix.fromToolchainFile toolchainFile;
        naersk = inputs.naersk.lib.${system}.override {
          cargo = rust-toolchain;
          rustc = rust-toolchain;
        };
        filter = inputs.nix-filter.lib;
        # The rust compiler is internally a cross compiler, so a single
        # toolchain can be used to compile multiple targets. In a hermetic
        # build system like nix flakes, there's effectively one package for
        # every permutation of the supported hosts and targets.
        rustPackage = target:
          naersk.buildPackage {
            root = ./.;
            src = filter.filter {
              root = ./.;
              include = [
                (filter.inDirectory "types")
                (filter.inDirectory "graphql")
                (filter.inDirectory "migration")
                ./Cargo.toml
                ./Cargo.lock
                ./rust-toolchain
              ];
            };
            # Make sure `cargo check` and `cargo test` pass.
            doCheck = true;
            doTest = true;

            # Prefer static linking
            nativeBuildInputs = with pkgs; [ pkgsStatic.stdenv.cc ];

            # Configures the target which will be built.
            # ref: https://doc.rust-lang.org/cargo/reference/config.html#buildtarget
            CARGO_BUILD_TARGET = target;

            # Enables static compilation.
            # ref: https://github.com/rust-lang/rust/issues/79624#issuecomment-737415388
            CARGO_BUILD_RUSTFLAGS =
              if target == null then "" else "-C target-feature=+crt-static";
          };
        nativePackage = rustPackage null;
        muslPackage = rustPackage "x86_64-unknown-linux-musl";
        dailpFunctions = with pkgs;
          stdenv.mkDerivation {
            name = "dailp-functions";
            buildInputs = [ zip ];
            # Permits a derivation with no source files.
            unpackPhase = "true";
            installPhase = ''
              mkdir -p $out
              cp -f ${muslPackage}/bin/dailp-graphql $out/bootstrap
              zip -j $out/dailp-graphql.zip $out/bootstrap
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
      in rec {
        # Add extra binary caches for quicker builds of the rust toolchain and MongoDB.
        nixConfig = {
          binaryCaches =
            [ "https://nix-community.cachix.org" "https://dailp.cachix.org" ];
          binaryCachePublicKeys = [
            "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
            "dailp.cachix.org-1:QKIYFfTB/jrD6J8wZoBEpML64ONrIxs3X5ifSKoJ3kA="
          ];
        };

        defaultPackage = with pkgs;
          stdenv.mkDerivation {
            name = "dailp";
            src = filter.filter {
              root = ./.;
              include =
                [ (filter.inDirectory "terraform") ./aws-certificate.pem ];
            };
            installPhase = ''
              mkdir -p $out
              cp -f ${terraformConfig}/config.tf.json $out/
            '';
          };

        apps.migrate-data = inputs.utils.lib.mkApp {
          drv = nativePackage;
          exePath = "/bin/dailp-migration";
        };

        apps.graphql = inputs.utils.lib.mkApp {
          drv = nativePackage;
          exePath = "/bin/dailp-graphql-local";
        };

        apps.tf-plan = mkBashApp "plan" ''
          ${tf} init ${defaultPackage}
          ${tf} plan ${defaultPackage}
        '';

        apps.tf-apply = mkBashApp "apply" ''
          ${tf} init ${defaultPackage}
          ${tf} apply ${defaultPackage}
        '';

        apps.tf-apply-now = mkBashApp "apply-now" ''
          ${tf} init ${defaultPackage}
          ${tf} apply -auto-approve ${defaultPackage}
        '';

        devShell = with pkgs;
          stdenv.mkDerivation rec {
            name = "dailp-dev";
            unpackPhase = "true";
            LD_LIBRARY_PATH = "${lib.makeLibraryPath buildInputs}";
            buildInputs = [
              autoconf
              automake
              libtool
              pkg-config
              file
              nasm
              terraform
              rust-toolchain
              yarn
              mongodb-4_2
              (writers.writeBashBin "dev-database" ''
                mkdir -p .mongo
                mongod --dbpath .mongo
              '')
              (writers.writeBashBin "dev-graphql" ''
                cargo run --bin dailp-graphql-local
              '')
              (writers.writeBashBin "dev-migrate" ''
                cargo run --bin dailp-migration
              '')
              (writers.writeBashBin "dev-website" ''
                cd website
                yarn start
              '')
              (writers.writeBashBin "output" ''
                terraform output $1
              '')
            ] ++ lib.optionals stdenv.isDarwin [
              darwin.apple_sdk.frameworks.Security
              libiconv
            ];
          };
      });
}
