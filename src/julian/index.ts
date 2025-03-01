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
		i.split("").slice(0, 3).join(""),
	);
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
	public unixToJd(ut: number) {
		return 2440587.5 + ut / 86400.0;
	}
	public jdToUnix(jd: number) {
		return Math.floor((jd - 2440587.5) * 86400.0 + 0.5);
	}
	public calendarConverter({ ct, year, month, day }: CalendarConvertOptions) {
	  const { jd, jdn } = this.gregorianToJd({ year, month, day });
	  const diff = helpers.secularDiff(year);
	  const jdd = ct === "julian" ? jd - diff : jd + diff;
	  const dt = this.julianToGergorian(jdd);
	  return { year: dt.year, month: dt.month, day: dt.day };
	}
}
