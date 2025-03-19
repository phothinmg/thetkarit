import { helpers } from "../helpers";
import { getOffset } from "../timezones";
import type { TimeZones } from "../timezones/tztypes";
import type { CalendarConvertOptions, G2JOptions } from "../types";

type IsG = "isg" | "isp" | "isnot";

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
		i.split("").slice(0, 3).join(""),
	);
	/**
	 * Date Time to Julian Date and Julian Day Number
	 * @param {G2JOptions}
	 * @returns {{jd:number;jdn:number}} Julian Date and Julian Day Number
	 */
	public dt2jd({
		year,
		month,
		day,
		hour = 12,
		minutes = 0,
		seconds = 0,
		tz = "GMT",
	}: G2JOptions): { jd: number; jdn: number } {
		const result = this.checkGregorian(year, month, day);
		if (result === "isnot") {
			day = 4;
		}
		const tzos = getOffset(tz) / 24;
		// To decimal fraction of the day
		// h , m , s
		const def = (hour - 12) / 24.0 + minutes / 1440.0 + seconds / 86400.0;
		// pre jdn
		const a: number = Math.floor((month - 3) / 12);
		const x4: number = year + a;
		const x3: number = Math.floor(x4 / 100);
		const x2: number = x4 % 100;
		const x1: number = month - 12 * a - 3;

		const _jdn: number =
			Math.floor((146097 * x3) / 4) +
			Math.floor((36525 * x2) / 100) +
			Math.floor((153 * x1 + 2) / 5) +
			day +
			1721119;

		let jd = _jdn + tzos + def;
		if (result === "isp") {
			jd += 10;
		}
		const jdn: number = Math.round(jd);
		return {
			jd,
			jdn,
		};
	}
	/**
	 * Julian Date to Date Time.
	 * @param jd Julian Date
	 * @returns Date Time Object
	 */
	public jd2dt(
		jd: number,
		tz: TimeZones = "GMT",
	): {
		year: number;
		month: number;
		day: number;
		hour: number;
		minutes: number;
		seconds: number;
	} {
		const tzz = getOffset(tz);
		const jdd = jd + tzz / 24;

		// JDN to Year Month Date
		const jdn = Math.round(jdd);

		const a = 4 * jdn - 6884477;
		const x3 = Math.floor(a / 146097);
		const r3 = a % 146097;

		const b = 100 * Math.floor(r3 / 4) + 99;
		const x2 = Math.floor(b / 36525);
		const r2 = b % 36525;

		const c = 5 * Math.floor(r2 / 100) + 2;
		const x1 = Math.floor(c / 153);
		const r1 = c % 153;

		const cc = Math.floor((x1 + 2) / 12);
		const year = 100 * x3 + x2 + cc;
		const month = x1 - 12 * cc + 3;
		const day = Math.floor(r1 / 5) + 1;

		// decimal fraction of JD to Hour Minute Second
		const j = Math.floor(jdd);
		const fjdn = jdd - j;
		const xx1 =
			fjdn >= 0.5
				? (fjdn * 86400 - 43200) / 3600
				: (fjdn * 86400 + 43200) / 3600;
		const hour = Math.floor(xx1);
		const xx2 = (xx1 - hour) * 3600;
		const xx3 = xx2 / 60;
		const minutes = Math.floor(xx3);
		const seconds = Math.floor((xx3 - minutes) * 60);
		return {
			year,
			month,
			day,
			hour,
			minutes,
			seconds,
		};
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
	 * Return the current UTC Julian Date.
	 * @returns The current UTC Julian Date.
	 */
	public jdutc(): number {
		const dt: Date = new Date();
		const unix: number = dt.getTime() / 1000;
		return this.unixToJd(unix);
	}
	/**
	 * Return the current Julian Date in the time zone of this instance.
	 * @returns The current Julian Date in the time zone of this instance.
	 */
	public jdNow(tz: TimeZones) {
		const tzz = getOffset(tz);
		return this.jdutc() + tzz / 24;
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
	public calC({ ct, year, month, day }: CalendarConvertOptions) {
		const { jd, jdn } = this.dt2jd({ year, month, day });
		const diff = helpers.secularDiff(year);
		const jdd = ct === "julian" ? jd - diff : jd + diff;
		const dt = this.jd2dt(jdd);
		return { year: dt.year, month: dt.month, day: dt.day };
	}
}
