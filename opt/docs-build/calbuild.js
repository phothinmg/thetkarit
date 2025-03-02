#!/usr/bin/env node
/** @import {BuildOptions} from "lwe8-build" */
import { build } from "lwe8-build";

await (async () => {
  /**
   * @type {BuildOptions}
   */
  const options = {
    format: ["browser"],
    indexFile: {
      path: "./opt/js/cal.js",
    },
    outputDirs: {
      browser: "./docs/calendar/js",
    },
    otherFiles: [
      {
        path: "./opt/js/navbar.js",
      },
      {
        path: "./opt/js/theme.js",
      },
    ],
    fileName: "index.js",
  };
  await build(options);
})();
