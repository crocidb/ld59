{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.bun
  ];

  shellHook = ''
    export BUN_INSTALL="$PWD/.bun"
    export PATH="$BUN_INSTALL/bin:$PWD/node_modules/.bin:$PATH"

    echo "bun: $(bun --version)"
    if [ ! -d node_modules ]; then
      echo "installing dependencies..."
      bun install
    fi

    if [ ! -d node_modules/http-server ]; then
      echo "installing http-server..."
      bun add -d http-server
    fi
  '';
}

