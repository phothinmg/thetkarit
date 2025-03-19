<div align="center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Peacock_symbol_Burma.svg" width="100" height="100" alt="pk">
    <h2>Thetkarit</h2>
</div>

![GitHub License](https://img.shields.io/github/license/phothinmg/thetkarit) ![NPM Version](https://img.shields.io/npm/v/thetkarit)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/msvc.yml?logo=cplusplus&label=MSVC%20Code%20Analysis)  ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phothinmg/thetkarit/cmake-multi-platform.yml?logo=cmake&label=CMake%20on%20multiple%20platforms)



## Overview

The Burmese calendar calculations focus on Burmese calendar and astronomy studies and are still in progress.

---

## Node Js

### Install

```bash
npm i thetkarit
```

```bash
yarn add thetkarit
```

```bash
pnpm add thetkarit
```

### Usage for Node js

```js
import { BurmeseCal } from "thetkarit"; // esm

const { BurmeseCal } = require("thetkarit"); //common js

const bcal = new BurmeseCal();
```

---

## Browser

**jsDelivr :** [https://www.jsdelivr.com/package/npm/burmese-calendar](https://www.jsdelivr.com/package/npm/burmese-calendar)

```html
<script src="https://cdn.jsdelivr.net/npm/burmese-calendar/cdn/index.min.js"></script>
```

## Resources

### Burmese Calendar

- The Algorithm for calculation of Burmese Calendar (Myanmar Calendar) and astrological calendar days by Dr. Yan Naing Aye.

- References:

  https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html

  https://cool-emerald.blogspot.com/2013/12/myanmar-astrological-calendar-days.html

### Julian Date and Moon Phases

- A collection of astronomy related programs, algorithms, tutorials, data and implementation of the algorithm from Meeus' Astronomical Algorithms for computing the dates of the phases of the Moon by Greg Miller (gmiller@gregmiller.net).

- Reference: https://www.celestialprogramming.com/

---
