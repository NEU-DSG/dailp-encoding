with import <nixpkgs> { };
mkShell rec {
  buildInputs = [ pkg-config openssl ];
  LD_LIBRARY_PATH = "${lib.makeLibraryPath buildInputs}";
}
