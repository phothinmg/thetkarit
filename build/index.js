#!/usr/bin/env node
/** @import {BuildOptions} from "lwe8-build" */
import { build } from "lwe8-build";

await (async () => {
  /**
   * @type {BuildOptions}
   */
  const options = {
    format: ["esm", "cjs", "browser"],
    indexFile: {
      path: "./src/index.ts",
      lines: 11,
    },
    outputDirs: {
      esm: "./dist",
      cjs: "./dist",
      browser: "./dist/cdn",
    },
    otherFiles: [
      {
        path: "./src/ui/index.ts",
      },
      {
        path: "./src/helpers/index.ts",
      },
      {
        path: "./src/types/index.ts",
        lines: 1,
      },
      // timezones --start
      {
        path: "./src/timezones/index.ts",
        lines: 2,
      },
      {
        path: "./src/timezones/tztypes.ts",
      },
      {
        path: "./src/timezones/timezoneInfo.ts",
      },
      {
        path: "./src/timezones/timezoneNames.ts",
      },
      // timezones --end
      // astro days -- start
      {
        path: "./src/bcal/astro-days/index.ts",
        removeExport: true,
      },
      // astro days -- end
      // holidays -- start
      {
        path: "./src/bcal/holidays/substituteHolidays.ts",
        removeExport: true,
      },
      {
        path: "./src/bcal/holidays/eidDays.ts",
        removeExport: true,
      },
      {
        path: "./src/bcal/holidays/deepavali.ts",
        removeExport: true,
      },
      {
        path: "./src/bcal/holidays/index.ts",
        removeExport: true,
        lines: 3,
      },
      // holidays -- end
      // translate -- start
      {
        path: "./src/bcal/translate/types.ts",
      },
      {
        path: "./src/bcal/translate/langs.ts",
        removeExport: true,
      },
      {
        path: "./src/bcal/translate/index.ts",
        removeExport: true,
        lines: 2,
      },
      // translate -- end
      // Bcal -- start
      {
        path: "./src/bcal/exceptions/index.ts",
        removeExport: true,
      },
      {
        path: "./src/bcal/index.ts",
        removeExport: true,
        lines: 1,
      },
      // Bcal -- end
      {
        path: "./src/julian/index.ts",
        lines: 3,
      },
    ],
  };
  await build(options);
})();
