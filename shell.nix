with (import <nixpkgs> { });

mkShell {
  shellHook = ''echo "Entered into NixShell" '';

  buildInputs = [
    pkgs.nodejs_20
  ];
}
