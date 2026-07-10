<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<div align="center">
<img src="https://susee.phothin.dev/logo/thetkarit/logo.webp" width="160" height="160" alt="susee" />
  <h1>thetkarit</h1>
</div>
<!-- markdownlint-enable MD033 -->

[![codecov](https://codecov.io/gh/phothinmg/thetkarit/graph/badge.svg?token=UQwT32ZB2Z)](https://codecov.io/gh/phothinmg/thetkarit)

## Overview

This project focuses on Burmese calendar calculations and astronomy studies and is still under active development.

Most of the code in this repository is in the public domain or released under an open source license. However, some code and/or data may use different copyright terms (usually still an open source license). See [Resources](#resources).

The package exports a default object with focused modules for calendar views, moon phases, sunrise and sunset calculations, time zone helpers, and small UI helpers.

<!-- cSpell:disable -->

Note: Variable-date holidays are handled in two ways: Thingyan and Myanmar New Year are calculated algorithmically, while holidays such as "Deepavali" and "Eid al-Adha" use maintained date tables.

---

## Node.js

### Install

```bash
npm install thetkarit
```

### ESM (JavaScript)

```js
import thetkarit from "thetkarit";

const day = thetkarit.calendar.dayView({
  year: 2025,
  month: 2,
  day: 12,
  lang: "English",
});

console.log("Sasana Year:", day.burmese_cal.sasana_year.id);
console.log("Burmese Year:", day.burmese_cal.burmese_year.id);
console.log("Burmese Month:", day.burmese_cal.burmese_month.str);
console.log("Moon Phase:", day.burmese_cal.moon_phase.str);
console.log("Fortnight Day:", day.burmese_cal.fortnight_day.id);
console.log("Day in Burmese Month:", day.burmese_cal.burmese_day.id);
console.log("Public Holidays:", day.burmese_cal.public_holiday.join(", "));
```

### TypeScript

```ts
import thetkarit from "thetkarit";

const day = thetkarit.calendar.dayView({
  year: 2025,
  month: 2,
  day: 12,
  lang: "English",
});

console.log("Sasana Year:", day.burmese_cal.sasana_year.id);
console.log("Burmese Year:", day.burmese_cal.burmese_year.id);
console.log("Burmese Month:", day.burmese_cal.burmese_month.str);
console.log("Moon Phase:", day.burmese_cal.moon_phase.str);
console.log("Fortnight Day:", day.burmese_cal.fortnight_day.id);
console.log("Day in Burmese Month:", day.burmese_cal.burmese_day.id);
console.log("Public Holidays:", day.burmese_cal.public_holiday.join(", "));
```

### CommonJS

```js
const thetkarit = require("thetkarit");

const day = thetkarit.calendar.dayView({
  year: 2025,
  month: 2,
  day: 12,
  lang: "English",
});

console.log("Sasana Year:", day.burmese_cal.sasana_year.id);
console.log("Burmese Year:", day.burmese_cal.burmese_year.id);
console.log("Burmese Month:", day.burmese_cal.burmese_month.str);
console.log("Moon Phase:", day.burmese_cal.moon_phase.str);
console.log("Fortnight Day:", day.burmese_cal.fortnight_day.id);
console.log("Day in Burmese Month:", day.burmese_cal.burmese_day.id);
console.log("Public Holidays:", day.burmese_cal.public_holiday.join(", "));
```

---

## TypeScript API

The default export exposes these runtime members:

- `calendar`
- `moon`
- `sunTimes(options)`
- `zoneOffset(timeZone)`
- `zoneInfo(timeZone)`
- `timeZones`
- `timeZonesInfo`
- `ui.blankCells`
- `ui.numberRange`

It also re-exports the main TypeScript types for calendar views, time zones, moon phases, and sun time calculations.

### Calendar

```ts
import thetkarit from "thetkarit";

const month = thetkarit.calendar.monthView({
  year: 2025,
  month: 4,
  lang: "English",
});

const thingyan = thetkarit.calendar.thingyan(2025);
const julian = thetkarit.calendar.datetimeToJd({
  year: 2025,
  month: 4,
  day: 17,
  hour: 12,
  tz: "Asia/Yangon",
});

console.log(month.month.long);
console.log(thingyan.NewYearDay);
console.log(julian.jd, julian.jdn);
```

Available calendar methods:

- `yearView({ year, lang })`
- `monthView({ year, month, lang })`
- `dayView({ year, month, day, lang })`
- `thingyan(year, yearType?)`
- `burmeseYearType(burmeseYear, lang?)`
- `datetimeToJd({ year, month, day, hour?, minutes?, seconds?, tz? })`
- `jdToDatetime(jd, tz?)`
- `calendarConverter({ ct, year, month, day })`

### Moon

```ts
import thetkarit from "thetkarit";

const phases = thetkarit.moon.moonPhaseStr(2025, 8);
const fullMoonDays = thetkarit.moon.fullmoonDay(2025, "Asia/Yangon");

console.log(phases.fullMoon);
console.log(fullMoonDays[0]);
```

Available moon methods:

- `moonPhases(year, month)`
- `moonPhaseStr(year, month)`
- `fullmoonDay(year, tz?)`
- `moonAge(tz?)`
- `meenusLunationNumber(year, month)`
- `brownLunationNumber(year, month)`
- `thaiLunationNumber(year, month)`

Note: the moon helpers use zero-based month values where `0 = January` and `11 = December`.

### Sun And Time Zones

```ts
import thetkarit from "thetkarit";

const sun = thetkarit.sunTimes({
  latitude: 16.8661,
  longitude: 96.1951,
  date: new Date("2025-02-12T00:00:00Z"),
  timezone: "Asia/Yangon",
});

const offset = thetkarit.zoneOffset("Asia/Yangon");
const info = thetkarit.zoneInfo("Asia/Yangon");

console.log(sun.sunrise, sun.sunset, sun.daytime);
console.log(offset);
console.log(info?.countryName, info?.currentOffset);
```

### Source Layout

The main modules under `/src` are organized as follows:

- `src/index.ts`: package entrypoint and public exports.
- `src/calendar/`: Burmese calendar, Gregorian conversions, translations, holidays, astrology days, and view builders.
- `src/moon/`: moon phase, full moon, lunation, and moon age calculations.
- `src/suntime/`: sunrise, sunset, and daytime duration calculations.
- `src/timezones/`: supported IANA time zones, offsets, and metadata.
- `src/calendar/ui/`: small helpers for calendar-oriented UI rendering.

## Resources

### Burmese Calendar

- The algorithm for calculating the Burmese Calendar (Myanmar Calendar) and astrological calendar days by Dr. Yan Naing Aye.

- References:

  <https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html>

  <https://cool-emerald.blogspot.com/2013/12/myanmar-astrological-calendar-days.html>

### Julian Date and Moon Phases

- A collection of astronomy-related programs, algorithms, tutorials, and data, including an implementation of the algorithm from Meeus' _Astronomical Algorithms_ for computing the dates of the Moon's phases, by Greg Miller (<gmiller@gregmiller.net>).

- Reference: <https://www.celestialprogramming.com/>

### Local sunrise and sunset times

- Based on the algorithm by Rui Okada: <https://gist.github.com/ruiokada/b28076d4911820ddcbbc>

- Computation references:
  - <https://en.wikipedia.org/wiki/Julian_day#Converting_Julian_or_Gregorian_calendar_date_to_Julian_Day_Number>
  - <https://en.wikipedia.org/wiki/Sunrise_equation#Complete_calculation_on_Earth>

---
