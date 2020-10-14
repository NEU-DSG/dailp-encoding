with import <nixpkgs> {
  # crossSystem.config = "x86_64-unknown-linux-musl";
};
mkShell rec {
  buildInputs = [ pkg-config openssl ];
  LD_LIBRARY_PATH = "${lib.makeLibraryPath buildInputs}";
}
