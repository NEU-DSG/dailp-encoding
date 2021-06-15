{
  inputs = {
    pkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
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
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = inputs.pkgs.legacyPackages.${system};
        toolchain = with inputs.fenix.packages.${system};
          combine [
            minimal.rustc
            minimal.cargo
            targets.x86_64-unknown-linux-musl.latest.rust-std
          ];
        naersk = inputs.naersk.lib.${system}.override {
          cargo = toolchain;
          rustc = toolchain;
        };
        filter = inputs.nix-filter.lib;
        rustPackage = naersk.buildPackage {
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
          # Make sure `cargo check` passes before building.
          doCheck = true;

          # Prefer static linking
          nativeBuildInputs = with pkgs; [ pkgsStatic.stdenv.cc ];

          # Configures the target which will be built.
          # ref: https://doc.rust-lang.org/cargo/reference/config.html#buildtarget
          CARGO_BUILD_TARGET = "x86_64-unknown-linux-musl";

          # Enables static compilation.
          # ref: https://github.com/rust-lang/rust/issues/79624#issuecomment-737415388
          CARGO_BUILD_RUSTFLAGS = "-C target-feature=+crt-static";
        };
        dailpFunctions = with pkgs;
          stdenv.mkDerivation {
            name = "dailp-functions";
            buildInputs = [ zip ];
            # Permits a derivation with no source files.
            unpackPhase = "true";
            installPhase = ''
              mkdir -p $out
              cp -f ${rustPackage}/bin/dailp-graphql $out/bootstrap
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
      in rec {
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

        # The rust compiler is internally a cross compiler, so a single
        # toolchain can be used to compile multiple targets. In a hermetic
        # build system like nix flakes, there's effectively one package for
        # every permutation of the supported hosts and targets.
        packages.x86_64-unknown-linux-musl = rustPackage;

        devShell = with pkgs;
          stdenv.mkDerivation {
            name = "dailp-dev";
            unpackPhase = "true";
            buildInputs = [
              terraform
              (writers.writeBashBin "plan" ''
                terraform init ${defaultPackage}
                terraform plan ${defaultPackage}
              '')
              (writers.writeBashBin "apply" ''
                terraform init ${defaultPackage}
                terraform apply ${defaultPackage}
              '')
              (writers.writeBashBin "apply-now" ''
                terraform init ${defaultPackage}
                terraform apply -auto-approve ${defaultPackage}
              '')
            ];
          };
      });
}
