# Thetkarit

## About

The package provides a JavaScript object of Burmese Calendar (Myanmar Calendar) data along with Gregorian calendar data.
It also provides some time zone information and conversion between Julian date, Julian calendar date and Gregorian calendar date.

## Install

```bash
npm i thetkarit
```

```bash
yarn add thetkarit
```

```bash
pnpm add thetkarit
```

## Use

```ts
// for calendar views
import { BurmeseCal } from "thetkarit";

const cal = new BurmeseCal();

console.log(cal.dateView({ year: 2025, month: 2, day: 12 }));
```


## Acknowledgement

### Burmese Calendar Calculation

- The Algorithm for calculation of Burmese Calendar (Myanmar Calendar) by Dr. Yan Naing Aye.

- Reference: https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html

### Julian dates Calculation

- A collection of astronomy related programs, algorithms, tutorials, and data by Greg Miller (gmiller@gregmiller.net).

- Reference: https://www.celestialprogramming.com/