#!/usr/bin/env node
import fs from "node:fs";
import $ from "dax-sh";
// Calendar UI
await (async function () {
  const calStyleOut = "./docs/index.css";
  $.logStep("[BuildCss]: With TailwindCss v.04 for calendar UI.");
  if (fs.existsSync(calStyleOut)) {
    fs.unlinkSync(calStyleOut);
  }
  await $.sleep(1000);
  await $`npx @tailwindcss/cli -i ./opt/css/cal.css -o ${calStyleOut} --minify`;
  $.logStep("[BuildJs]: Javascript for calendar UI.");
  await $.sleep(1000);
  await $`./opt/calbuild.js`;
})();
