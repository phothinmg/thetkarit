import path from "node:path";
import { wait } from "../helpers";
import bundle from "./bundle";
import { commonjsCompiler, esmCompiler, type OutPutHook } from "./compile";

const entry = "src/index.ts";
const outDir = "dist";

const licenseText = `
/*! *************************************************
Copyright (c) Pho Thin Mg <phothinmg@disroot.org>

Licensed under the ISC License (the "License"):

Permission to use, copy, modify, and/or distribute 
this software for any purpose with or without fee 
is hereby granted, provided that the above copyright 
notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR 
DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY 
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE 
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL 
DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS 
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF 
CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING 
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF 
THIS SOFTWARE.
********************************************************* */
`.trim();

/**
 * Given a string, returns a function that can be used as a hook to add the given string as a banner to
 * the top of the generated JavaScript file. The given string is only prepended to files with a `.js`
 * extension.
 *
 * @param {string} str The string to use as the banner.
 * @returns {OutPutHook} A function that can be used as a hook to add the given string as a banner.
 */
const bannerText = (str: string): OutPutHook => {
  return (code, file) => {
    if (path.extname(file as string) === ".js") {
      code = `${str}\n${code}`;
    }
    return code;
  };
};

/**
 * Builds the project.
 *
 * Bundles the source code using the {@link bundle} function and then compiles it to CommonJS and ESM
 * formats using the {@link commonjsCompiler} and {@link esmCompiler} functions, respectively. The
 * resulting files are written to the {@link outDir} directory.
 *
 * Note that this function does not return anything. It is only meant to be called directly.
 */
async function build() {
  console.time("Build Time");
  const sourceCode = await bundle(entry);
  await wait(1000);
  commonjsCompiler(sourceCode, outDir, entry, [bannerText(licenseText)]);
  await wait(2000);
  esmCompiler(sourceCode, outDir, entry, [bannerText(licenseText)]);
  console.timeEnd("Build Time");
}

await build();
