module.exports = {
  require: ["esbuild-register"],
  extension: ["ts"],
  watchExtensions: ["ts"],
  // Extension tests run inside of VSCode instance, so we don't include them here
  spec: [
    "packages/vscode-host/src/**/*.test.ts",
  ],
};
