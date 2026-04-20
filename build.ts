import { build } from "susee";

await build({
  entryPoints: [
    {
      entry: "src/index.ts",
      exportPath: ".",
      format: ["commonjs", "esm"],
    },
  ],
  allowUpdatePackageJson: true,
});
