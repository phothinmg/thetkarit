# Thetkarit

[![CMake on multiple platforms](https://github.com/phothinmg/thetkarit/actions/workflows/cmake-multi-platform.yml/badge.svg)](https://github.com/phothinmg/thetkarit/actions/workflows/cmake-multi-platform.yml) ![GitHub License](https://img.shields.io/github/license/phothinmg/thetkarit) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/codeql.yml?logo=github&label=CodeQL) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/msvc.yml?logo=cplusplus&label=MSVC%20Code%20Analysis) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/cmake-multi-platform.yml?logo=cmake&label=CMake%20on%20multiple%20platforms) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/codeql.yml?logo=github&label=CodeQL)

## Overview

This project focuses on Burmese calendar calculations and astronomy studies and is still under active development.

Most of the code in this repository is in the public domain or released under an open source license. However, some code and/or data may use different copyright terms (usually still an open source license). See [Resources](#resources).

<!-- cSpell:disable -->

Note: Variable-date holidays are handled in two ways: Thingyan and Myanmar New Year are calculated algorithmically, while holidays such as "Deepavali" and "Eid al-Adha" use maintained date tables.

---

## C++

Download the latest `thetkarit.zip` from <https://github.com/phothinmg/thetkarit/releases/latest/download/thetkarit.zip>.

````cpp
#include "thetkarit/bcal.hpp" // include bcal header
#include <iostream>
#include <iomanip>

/// @brief Gregorian Calendar Date to Burmese Calendar Date
int main()
{
    bcal::BcalInfo dv = bcal::day_v(2025, 2, 12).bcal_info;
    std::cout << "Sasana Year: " << std::setprecision(0) << dv.sasana_year << std::endl;
    std::cout << "Burmese Year: " << std::setprecision(0) << dv.burmese_year << std::endl;
    std::cout << "Burmese Month: " << dv.burmese_month_str << std::endl;
    std::cout << "Moon Phase: " << dv.moon_phases_str << std::endl;
    std::cout << "Fortnight Day: " << std::setprecision(0) << dv.fortnight_day << std::endl;
    std::cout << "Day in Burmese Month: " << std::setprecision(0) << dv.burmese_day << std::endl;
    std::cout << "Public Holidays: ";
    for (const auto &holiday : dv.public_holiday)
    {
        std::cout << holiday << std::endl;
    }
}

```text
Sasana Year: 2568
Burmese Year: 1386
Burmese Month: Tabodwe
Moon Phase: Waxing
Fortnight Day: 12
Day in Burmese Month: 12
Public Holidays: Union Day
````

### Build and Run the C++ Example

Clone the repository, build it with CMake, and run the example:

```bash
git clone https://github.com/phothinmg/thetkarit.git
cd thetkarit
mkdir build
cd build
cmake ..
make
./bcal # Run the example
```

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
