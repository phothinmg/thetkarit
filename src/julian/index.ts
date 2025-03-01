import { helpers } from "../helpers";
import { currentOffset } from "../timezones";
import type { TimeZones } from "../timezones/tztypes";
type IsG = "isg" | "isp" | "isnot";
type G2JOptions = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minutes?: number;
  seconds?: number;
  tz?: TimeZones;
};
export type CalendarTypes = "gregorian" | "julian";
export type CalendarConvertOptions = {
  ct: CalendarTypes;
  year: number;
  month: number;
  day: number;
};

// A collection of astronomy related programs, algorithms, tutorials, and data by Greg Miller (gmiller@gregmiller.net).
// Reference: https://www.celestialprogramming.com/

export class BcGcal {
  private checkGregorian(y: number, m: number, d: number): IsG {
    if (y < 1582 || (y === 1582 && (m < 10 || (m === 10 && d <= 4)))) {
      return "isp";
    } else if (y === 1582 && m === 10 && d > 4 && d < 15) {
      return "isnot";
    } else {
      return "isg";
    }
  }
  private INT(d: number) {
    if (d > 0) {
      return Math.floor(d);
    }
    if (d === Math.floor(d)) {
      return d;
    }
    return Math.floor(d) - 1;
  }
  public MONTHS: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  public MONTH_SHORT = this.MONTHS.map((i) => i.split("").slice(0, 3).join(""));
  public WEEK_DAYS: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  public WEEK_DAYS_SHORT = this.WEEK_DAYS.map((i) =>
    i.split("").slice(0, 3).join("")
  );
  /**
   * Converts a Gregorian date to a Julian Day Number.
   *
   * @param {G2JOptions} options - An object containing the Gregorian date to be converted.
   * @param {number} options.year - The year of the Gregorian date.
   * @param {number} options.month - The month of the Gregorian date.
   * @param {number} options.day - The day of the Gregorian date.
   * @param {number} [options.hour=12] - The hour of the Gregorian date.
   * @param {number} [options.minutes=0] - The minutes of the Gregorian date.
   * @param {number} [options.seconds=0] - The seconds of the Gregorian date.
   * @param {string} [options.tz="GMT"] - The timezone of the Gregorian date.
   * @return {object} - An object containing the Julian Day (jd) and the Julian Day Number (jdn).
   */
  public gregorianToJd({
    year,
    month,
    day,
    hour = 12,
    minutes = 0,
    seconds = 0,
    tz = "GMT",
  }: G2JOptions) {
    const result = this.checkGregorian(year, month, day);
    if (result === "isnot") {
      day = 4;
    }
    if (month < 3) {
      year = year - 1;
      month = month + 12;
    }
    const a = this.INT(year / 100.0);
    const b = 2 - a + this.INT(a / 4.0);
    const tzos = currentOffset(tz) / 24;
    const def = (hour - 12) / 24.0 + minutes / 1440.0 + seconds / 86400.0;
    let jd =
      this.INT(365.25 * (year + 4716)) +
      this.INT(30.6001 * (month + 1)) +
      day +
      b -
      1524.5 +
      tzos +
      def;
    if (result === "isp") {
      jd += 10;
    }
    const jdn = Math.round(jd);
    return { jd, jdn };
  }

  /**
   * Converts a Julian Day to a Gregorian date.
   * @param {number} jd - The Julian Day to be converted.
   * @param {string} [tz="GMT"] - The timezone of the Gregorian date.
   * @return {object} - An object containing the Gregorian date in the format { year, month, day, hour, minutes, seconds }.
   */
  public julianToGergorian(jd: number, tz?: TimeZones) {
    const tzz = tz ?? "GMT";
    const tzos = currentOffset(tzz);
    const temp = jd + 0.5 + tzos / 24;
    const Z = Math.trunc(temp);
    const F = temp - Z;
    let A = Z;
    if (Z >= 2299161) {
      const alpha = this.INT((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - this.INT(alpha / 4);
    }
    const B = A + 1524;
    const C = this.INT((B - 122.1) / 365.25);
    const D = this.INT(365.25 * C);
    const E = this.INT((B - D) / 30.6001);
    const day = B - D - this.INT(30.6001 * E) + F;
    let month = E - 1;
    if (E > 13) {
      month = E - 13;
    }
    let year = C - 4716;
    if (month < 3) {
      year = C - 4715;
    }
    const P = F * 24;
    const hour = Math.trunc(P);
    const H = (P - hour) * 60;
    const minutes = Math.trunc(H);
    const O = (H - minutes) * 60;
    const seconds = Math.round(O);
    return { year, month, day, hour, minutes, seconds };
  }
  /**
   * Converts Unix time (seconds since 1970-01-01T00:00:00Z) to Julian Day.
   *
   * @param ut - The Unix time to be converted.
   * @returns The corresponding Julian Day.
   */

  public unixToJd(ut: number) {
    return 2440587.5 + ut / 86400.0;
  }
  /**
   * Converts a Julian Day to Unix time (seconds since 1970-01-01T00:00:00Z).
   *
   * @param jd - The Julian Day to be converted.
   * @returns The corresponding Unix time.
   */
  public jdToUnix(jd: number) {
    return Math.floor((jd - 2440587.5) * 86400.0 + 0.5);
  }
  /**
   * Converts a Gregorian calendar date and Julian calendar date each other.
   *
   * @param {CalendarConvertOptions} options - An object with the following properties:
   *   - ct: The calendar type to convert to. Either "julian" or "gregorian".
   *   - year: The year to be converted.
   *   - month: The month to be converted [1=Jan,...,12=Dec].
   *   - day: The day to be converted [1-31].
   * @returns An object with the year, month and day of the converted date.
   */
  public calendarConverter({ ct, year, month, day }: CalendarConvertOptions) {
    const { jd, jdn } = this.gregorianToJd({ year, month, day });
    const diff = helpers.secularDiff(year);
    const jdd = ct === "julian" ? jd - diff : jd + diff;
    const dt = this.julianToGergorian(jdd);
    return { year: dt.year, month: dt.month, day: dt.day };
  }
}
