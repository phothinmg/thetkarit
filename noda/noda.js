/** @import {Res} from "./noda-type" */
/** @import {TzInfo} from "./noda-type" */
import fs from "node:fs";

function strNum(str) {
  const a = str.split(" ")[0];
  const b = a.split(":")[0];
  const c = a.split(":")[1];
  const _d = c ? Number(c) / 60 : 0;
  const e = b.slice(0, 1);
  const _f = Number(b.slice(1));
  return e === "-" ? -(_f + _d) : _f + _d;
}
const ianaVersion = "2025a",
  url = `https://nodatime.org/TimeZones?version=${ianaVersion}&format=json`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    /** @type {Res} */
    const zonesData = data;
    /** @type {TzInfo} */
    const timeZonesInfo = [];
    /** @type {string[]} */
    const aa = [];
    for (const zone of zonesData.zones) {
      aa.push(zone.id);
      aa.push(...zone.aliases);
      timeZonesInfo.push({
        names: [zone.id, ...zone.aliases],
        countryCode: zone.location?.countryCode ?? "",
        countryName: zone.location?.countryName ?? "",
        latitude: zone.location?.latitude ?? 0,
        longitude: zone.location?.longitude ?? 0,
        offsets: zone.offsets,
        currentOffset: strNum(zone.currentOffset),
      });
    }
    // make sure its string to join because of "/"
    const zz = aa.map((i) => `"${i}"`);
    const cc = zz.join(" | ");
    const xx = [...zz];
    const namesText = `export const timeZones = [${xx}]`;
    const _bb = `export type TimeZones = ${cc}`;
    const info_text = `export const timeZonesInfo  = ${JSON.stringify(
      timeZonesInfo,
      null,
      2
    )}`;
    const type_file = "./src/timezones/tztypes.ts";
    const info_file = "./src/timezones/timezoneInfo.ts";
    const zones_file = "./src/timezones/timezoneNames.ts";
    if (fs.existsSync(type_file)) {
      fs.unlinkSync(type_file);
    }
    if (fs.existsSync(info_file)) {
      fs.unlinkSync(info_file);
    }
    if (fs.existsSync(zones_file)) {
      fs.unlinkSync(zones_file);
    }
    fs.writeFileSync(zones_file, namesText);
    fs.writeFileSync(type_file, _bb);
    fs.writeFileSync(info_file, info_text);
  });
