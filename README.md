<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<div align="center">
<img src="https://susee.phothin.dev/logo/thetkarit/logo.webp" width="160" height="160" alt="susee" />
  <h1>Thetkarit</h1>
</div>
<!-- markdownlint-enable MD033 -->

## Overview

This project focuses on Burmese calendar calculations and astronomy studies and is still under active development.

Most of the code in this repository is in the public domain or released under an open source license. However, some code and/or data may use different copyright terms (usually still an open source license). See [Resources](#resources).

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
import Thetkarit from "thetkarit";

const cal = new Thetkarit.BurmeseCal();
const day = cal.dayView({
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
import Thetkarit from "thetkarit";

const cal = new Thetkarit.BurmeseCal();
const day = cal.dayView({
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
const Thetkarit = require("thetkarit");

const cal = new Thetkarit.BurmeseCal();
const day = cal.dayView({
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
