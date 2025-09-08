# Thetkarit

![Pecok](https://upload.wikimedia.org/wikipedia/commons/a/a5/Peacock_symbol_Burma.svg)

![GitHub License](https://img.shields.io/github/license/phothinmg/thetkarit) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/codeql.yml?logo=github&label=CodeQL) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/msvc.yml?logo=cplusplus&label=MSVC%20Code%20Analysis) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/cmake-multi-platform.yml?logo=cmake&label=CMake%20on%20multiple%20platforms) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/codeql.yml?logo=github&label=CodeQL)

## Overview

The Burmese calendar calculations focus on Burmese calendar and astronomy studies and are still in progress.

Most of the code here is in the public domain or released under an open source license, though some code and/or data may be under other copyright (usually an open source license), see [Resources](#resources).

---

## C++

### Useage

Download latest `thetkarit.zip` from <https://github.com/phothinmg/thetkarit/releases/latest/download/thetkarit.zip>.

```cpp
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
```

### Example C++ program

Clone the repository and build it using cmake, and run;

```bash
git clone https://github.com/phothinmg/thetkarit.git
cd thetkarit
mkdir build
cd build
cmake ..
make
./bcal # Running example
```

---

## Resources

### Burmese Calendar

- The Algorithm for calculation of Burmese Calendar (Myanmar Calendar) and astrological calendar days by Dr. Yan Naing Aye.

- References:

  <https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html>

  <https://cool-emerald.blogspot.com/2013/12/myanmar-astrological-calendar-days.html>

### Julian Date and Moon Phases

- A collection of astronomy related programs, algorithms, tutorials, data and implementation of the algorithm from Meeus' Astronomical Algorithms for computing the dates of the phases of the Moon by Greg Miller (<gmiller@gregmiller.net>).

- Reference: <https://www.celestialprogramming.com/>

---
