
## Thetkarit

### About

The package provides a JavaScript object of Burmese Calendar (Myanmar Calendar) data along with Gregorian calendar data.
It also provides some time zone information and conversion between Julian date, Julian calendar date and Gregorian calendar date.

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

### Use

```ts
// for calendar views
import { BurmeseCal } from "thetkarit";

const cal = new BurmeseCal();

console.log(cal.dateView({ year: 2025, month: 2, day: 12 }));

```
```ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.log('goodbye')
```