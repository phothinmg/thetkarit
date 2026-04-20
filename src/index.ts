// cSpell:disable
import { BcAstro } from "./bcal/astro-days/index.js";
import { BcHolidays } from "./bcal/holidays/index.js";
import { BcCal, type JTB } from "./bcal/index.js";
import { BcTranslate } from "./bcal/translate/index.js";
import type { Language } from "./bcal/translate/types.js";
import { helpers } from "./helpers/index.js";
import { BcGcal } from "./julian/index.js";
import type { TimeZones } from "./timezones/tztypes.js";
import type {
	CalendarConvertOptions,
	DayViewObject,
	DayViewOptions,
	G2JOptions,
	MonthViewObject,
	MontnViewOptions,
	ThinGyan,
	YearViewObject,
	YearViewOptions,
} from "./types/index.js";

const G = new BcGcal();

// New instances
const T = new BcTranslate();
const B = new BcCal();

//
/*!
The Algorithm for calculation of Burmese Calendar (Myanmar Calendar) by Dr. Yan Naing Aye.
Reference: https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html
 */
class BurmeseCal {
	private _lang: Language = "English";
	private _year: number = new Date().getFullYear();
	private month_ = new Date().getMonth();
	private _date = new Date().getDate();
	private is_now(y: number, m: number, d: number): boolean {
		return y === this._year && m === this.month_ && d === this._date;
	}
	private cal() {
		// days of each month in this._langyear
		const month_array: number[] = helpers.daysInMonth(this._year);
		const diy = helpers.isLeapYear(this._year) ? 366 : 365;
		// Sasana year and temp storage for that
		let _ssy: string | number = "";
		const ssy_str: string[] = [];
		const ssy_num: number[] = [];
		const ssy_ids: number[] = [];
		// Burmese year and temp storage for that
		let _by: string | number = "";
		const by_str: string[] = [];
		const by_num: number[] = [];
		const by_ids: number[] = [];
		// year object
		const year_object: YearViewObject = {
			year: {
				id: this._year,
				str: T.translateNum(this._year, this._lang),
				days_in_year: diy,
			},
			sasana_years: {
				ids: [],
				str: [],
			},
			burmese_years: {
				ids: [],
				str: [],
			},
			month_views: [],
		};
		// ==========================
		//     Start of Months loop
		// ==========================
		for (let i = 0; i < 12; i++) {
			const days_InMonth: number = month_array[i] ?? 0;
			const bm_str: string[] = [];
			const bm_index: number[] = [];
			const month_object: MonthViewObject = {
				year: {
					id: this._year,
					str: T.translateNum(this._year, this._lang),
				},
				month: {
					id: i + 1,
					long: T.translateStr(G.MONTHS[i] ?? "", this._lang) as string,
					short: G.MONTH_SHORT[i] ?? "",
					days_in_month: days_InMonth,
				},
				sasana_years: {
					ids: [],
					str: [],
				},
				burmese_years: {
					ids: [],
					str: [],
				},
				burmese_months: {
					index: [],
					str: [],
				},
				date_views: [],
			};
			// ==========================
			//     Start of Days loop
			// ==========================
			for (let j = 1; j <= days_InMonth; j++) {
				const _month = i + 1;
				// get jd
				// biome-ignore lint/correctness/noUnusedVariables: only need jdn
				const { jd, jdn } = G.dt2jd({
					year: this._year,
					month: _month,
					day: j,
				});
				const wd = helpers.weekdayId(jdn);
				const _wd = helpers.weekday_id(wd);
				// Burmese Calendar Info
				const bcal: JTB = B.j2b(jdn);
				const astro = new BcAstro({
					by: bcal.by,
					bm: bcal.bm,
					bd: bcal.bd,
					wd: _wd,
					lm: bcal.bml,
				});
				const hlds = new BcHolidays({
					jdn: jdn,
					year: this._year,
					month: _month,
					day: j,
					mp: bcal.mp,
					bmt: bcal.bmt,
					by: bcal.by,
					bm: bcal.bm,
					bd: bcal.bd,
				});
				bm_str.push(T.translateStr(bcal.bm_str, this._lang) as string);
				bm_index.push(bcal.bm);
				ssy_ids.push(bcal.ssy);
				by_ids.push(bcal.by);
				// _ssy
				_ssy = T.translateNum(bcal.ssy, this._lang);
				if (typeof _ssy === "string") {
					ssy_str.push(_ssy);
				} else if (typeof _ssy === "number") {
					ssy_num.push(_ssy);
				}
				// _by
				_by = T.translateNum(bcal.by, this._lang);
				if (typeof _by === "string") {
					by_str.push(_by);
				} else if (typeof _by === "number") {
					by_num.push(_by);
				}
				const date_object: DayViewObject = {
					jdn: jdn,
					year: {
						id: this._year,
						str: T.translateNum(this._year, this._lang),
					},
					month: {
						id: i + 1,
						long: T.translateStr(G.MONTHS[i] ?? "", this._lang) as string,
						short: G.MONTH_SHORT[i] ?? "",
						days_in_month: days_InMonth,
					},
					day: {
						id: j,
						str: T.translateNum(j, this._lang),
					},
					weekday: {
						index: wd,
						long: T.translateStr(G.WEEK_DAYS[wd] ?? "", this._lang) as string,
						short: G.WEEK_DAYS_SHORT[wd] ?? "",
					},
					isHoliday: hlds.holidaysArray.length > 0,
					isNow: this.is_now(this._year, i + 1, j),
					burmese_cal: {
						sasana_year: {
							id: bcal.ssy,
							str: T.translateNum(bcal.ssy, this._lang),
						},
						burmese_year: {
							id: bcal.by,
							str: T.translateNum(bcal.by, this._lang),
						},
						burmese_month: {
							index: bcal.bm,
							str: T.translateStr(bcal.bm_str, this._lang) as string,
						},
						moon_phase: {
							index: bcal.mp,
							str: T.translateStr(bcal.mp_str, this._lang) as string,
						},
						fortnight_day: {
							id: bcal.fd,
							str: T.translateNum(bcal.fd, this._lang),
						},
						burmese_day: {
							id: bcal.bd,
							str: T.translateNum(bcal.bd, this._lang),
						},
						sabbath: {
							index: astro.sabbath.index,
							str: T.translateStr(astro.sabbath.str, this._lang) as string,
							school_holiday: bcal.warDwin && astro.sabbath.index === 1,
						},
						yatyaza: {
							index: astro.yatyaza.index,
							str: T.translateStr(astro.yatyaza.str, this._lang) as string,
						},
						pyathada: {
							index: astro.pyathada.index,
							str: T.translateStr(astro.pyathada.str, this._lang) as string,
						},
						nagahle: {
							index: astro.nagahle.index,
							str: T.translateStr(astro.nagahle.str, this._lang) as string,
						},
						nakhat: {
							index: astro.natkhat.index,
							str: T.translateStr(astro.natkhat.str, this._lang) as string,
						},
						mahabote: {
							index: astro.mahabote.index,
							str: T.translateStr(astro.mahabote.str, this._lang) as string,
						},
						astro_days: T.translateStr(astro.astroDays, this._lang) as string[],
						public_holiday: T.translateStr(
							hlds.holidaysArray,
							this._lang,
						) as string[],
					},
				};
				// push day object to month object end of days loop
				month_object.date_views.push(date_object);
				// == End of Days loop
			}
			// remove all duplicate values from string or number arrays of month object push by days loop
			month_object.burmese_months.index = helpers.uniqNumber(bm_index);
			month_object.burmese_months.str = helpers.uniqString(bm_str);
			// push ssy from temp storage
			month_object.sasana_years.ids = helpers.uniqNumber(ssy_ids);
			month_object.sasana_years.str =
				typeof _ssy === "string"
					? helpers.uniqString(ssy_str)
					: helpers.uniqNumber(ssy_num);
			// push burmese year from temp storage
			month_object.burmese_years.ids = helpers.uniqNumber(by_ids);
			month_object.burmese_years.str =
				typeof _by === "string"
					? helpers.uniqString(by_str)
					: helpers.uniqNumber(by_num);
			// push month object to year object
			year_object.month_views.push(month_object);
			// End of Months loop
		}
		// remove all duplicate values from string or number arrays of year object push by  days and months loops
		year_object.sasana_years.ids = helpers.uniqNumber(ssy_ids);
		year_object.sasana_years.str =
			typeof _ssy === "string"
				? helpers.uniqString(ssy_str)
				: helpers.uniqNumber(ssy_num);
		// --
		year_object.burmese_years.ids = helpers.uniqNumber(by_ids);
		year_object.burmese_years.str =
			typeof _by === "string"
				? helpers.uniqString(by_str)
				: helpers.uniqNumber(by_num);
		return year_object;
	}

	/**
	 * Get the Burmese calendar data for a given Gregorian year.
	 *
	 * The method takes a Gregorian year and an optional language setting and
	 * returns the corresponding Burmese calendar data for that year.
	 *
	 * @param year - The Gregorian year.
	 * @param lang - Optional language setting for the year view. Defaults to "English".
	 * @returns The Burmese calendar data for the given year.
	 */
	public yearView({ year, lang = "English" }: YearViewOptions): YearViewObject {
		this._year = year;
		this._lang = lang;
		return this.cal();
	}
	/**
	 * Get the Burmese calendar data for a given Gregorian month.
	 *
	 * The method takes a Gregorian year, month and an optional language setting and
	 * returns the corresponding Burmese calendar data for that month.
	 *
	 * @param year - The Gregorian year.
	 * @param month - The Gregorian month (1-12).
	 * @param lang - Optional language setting for the month view. Defaults to "English".
	 * @returns The Burmese calendar data for the given month.
	 */
	public monthView({
		year,
		month,
		lang = "English",
	}: MontnViewOptions): MonthViewObject {
		this._year = year;
		this._lang = lang;
		return this.cal().month_views[month - 1] as MonthViewObject;
	}

	/**
	 * Get the Burmese calendar data for a specific day in a given Gregorian month and year.
	 *
	 * The method takes a Gregorian year, month, day, and an optional language setting,
	 * and returns the corresponding Burmese calendar data for that specific day.
	 *
	 * @param year - The Gregorian year.
	 * @param month - The Gregorian month (1-12).
	 * @param day - The Gregorian day (1-31).
	 * @param lang - Optional language setting for the day view. Defaults to "English".
	 * @returns The Burmese calendar data for the given day.
	 */
	public dayView({
		year,
		month,
		day,
		lang = "English",
	}: DayViewOptions): DayViewObject {
		this._year = year;
		this._lang = lang;
		return (this.cal().month_views[month - 1] as MonthViewObject).date_views[
			day - 1
		] as DayViewObject;
	}
	/**
	 * Calculate the Thingyan festival times for a given Burmese year.
	 *
	 * This method computes the Julian Dates and Julian Day Numbers for the
	 * Atat and Akya times during the Thingyan festival for a specified
	 * Burmese year. The Thingyan festival marks the Burmese New Year and
	 * occurs annually.
	 *
	 * @param by - The Burmese year for which Thingyan times are calculated.
	 * @returns An object containing:
	 *  - ja: Julian Date of Atat Time for the given year.
	 *  - jk: Julian Date of Akya Time for the given year.
	 *  - da: Julian Day Number of Atat Time for the given year.
	 *  - dk: Julian Day Number of Akya Time for the given year.
	 * @throws Will throw an error if the Burmese year is before 1100,
	 *         as Thingyan calculations are not applicable.
	 */
	private thingyanTime(by: number): {
		/**
		 * Julian Date(jd) of Atat Time for given Burmese Year
		 */
		ja: number;
		/**
		 * Julian Date(jd) of Akya Time for given Burmese Year.
		 */
		jk: number;
		/**
		 * Julian Day Number(jdn) of Atat Time for given Burmese Year
		 */
		da: number;
		/**
		 * Julian Day Number(jdn) of Akya Time for given Burmese Year
		 */
		dk: number;
	} {
		//start of Thingyan
		const BGNTG: number = 1100;
		// Burmese year of changing Atar Time.
		const SE3: number = 1312;
		if (by < BGNTG) {
			throw new Error("Thingyan was started Burmese Year of 1100");
		}
		// Julian Date(jd) of Atat Time for given Burmese Year
		const ja: number = B.SY * by + B.MO;
		// Julian Day Number(jdn) of Atat Time for given Burmese Year
		const da: number = Math.round(ja);
		// Length of Thingyan festival in days.
		const atarTime: number = by >= SE3 ? 2.169918982 : 2.1675;
		// Julian Date(jd) of Akya Time for given Burmese Year.
		const jk: number = ja - atarTime;
		// Julian Day Number(jdn) of Akya Time for given Burmese Year
		const dk: number = Math.round(jk);
		return { ja, jk, da, dk };
	}
	private thingyanDays(yearTo: number): ThinGyan {
		// Calculate the Myanmar year from which the festival dates are calculated.
		const YearTo: number = yearTo;
		// Calculate the Myanmar year to which the festival dates are calculated.
		const YearFrom: number = yearTo - 1;

		// Calculate the Julian Date and Julian Day Number for the festival dates.
		const tgTime = this.thingyanTime(YearTo);
		// Calculate the Atat Time for the given Myanmar year.
		const atat = G.jd2dt(tgTime.ja);

		// Format the Atat Time as a string.
		const AtatDayTime: string = new Date(
			atat.year,
			atat.month - 1,
			atat.day,
			atat.hour,
			atat.minutes,
			atat.seconds,
		).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			weekday: "short",
			hour12: true,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		// Calculate the Akya Time for the given Myanmar year.
		const akya = G.jd2dt(tgTime.jk);

		// Format the Akya Time as a string.
		const AkyaDayTime: string = new Date(
			akya.year,
			akya.month - 1,
			akya.day,
			akya.hour,
			akya.minutes,
			akya.seconds,
		).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			weekday: "short",
			hour12: true,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		// Calculate the day of the Akyo Time for the given Myanmar year.
		const akyo = G.jd2dt(tgTime.dk - 1);
		// Format the Akyo Time day as a string.
		const AkyoDay: string = new Date(
			akyo.year,
			akyo.month - 1,
			akyo.day,
		).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			weekday: "short",
		});

		// Calculate the day of the Akyat Time for the given Myanmar year.
		const akyat = G.jd2dt(tgTime.dk + 1);
		// Format the Akyat Time day as a string.
		const AkyatDay: string = new Date(
			akyat.year,
			akyat.month - 1,
			akyat.day,
		).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			weekday: "short",
		});

		// Check if there is a second Akyat Time and calculate its day if there is.
		let AkyatDay2 = "";
		let akyatday2 = false;
		if (tgTime.da - tgTime.dk > 2) {
			const akyat2 = G.jd2dt(tgTime.da - 1);
			AkyatDay2 = new Date(
				akyat2.year,
				akyat2.month - 1,
				akyat2.day,
			).toLocaleString("en-US", {
				year: "numeric",
				month: "short",
				day: "2-digit",
				weekday: "short",
			});
			akyatday2 = true;
		}
		// Calculate the day of the New Year Day following the festival.
		const newyear = G.jd2dt(tgTime.da + 1);
		// Format the New Year Day as a string.
		const NewYearDay: string = new Date(
			newyear.year,
			newyear.month - 1,
			newyear.day,
		).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			weekday: "short",
		});

		// Return the festival dates and times.
		return {
			YearFrom,
			YearTo,
			AkyoDay,
			AkyaDayTime,
			AkyatDay,
			AkyatDay2,
			AtatDayTime,
			NewYearDay,
			akyatday2,
		};
	}
	private thingyanFromG(gYear: number): ThinGyan {
		const jdn = G.dt2jd({ year: gYear, month: 1, day: 1 }).jdn;
		const by = B.j2b(jdn).by;
		const yearTo = by + 1;
		return this.thingyanDays(yearTo);
	}
	/**
	 * Calculates the Thingyan festival dates and times for the given year.
	 *
	 * The method takes two parameters: the year and the year type. The year
	 * type can be either "Burmese" or "Gregorian". If the year type is not
	 * provided, the default value is "Gregorian". If the year type is "Burmese",
	 * the method returns the Thingyan festival dates and times for the given
	 * Burmese year. If the year type is "Gregorian", the method returns the
	 * Thingyan festival dates and times for the given Gregorian year.
	 *
	 * @param year - The year to be calculated.
	 * @param yearType - The year type. The default value is "Gregorian".
	 * @returns An object with the following properties:
	 *   - YearFrom: The Burmese year that the festival starts.
	 *   - YearTo: The Burmese year that the festival ends.
	 *   - AkyoDay: The day of the first day of the festival.
	 *   - AkyaDayTime: The time of the first day of the festival.
	 *   - AkyatDay: The day of the second day of the festival.
	 *   - AkyatDay2: The day of the third day of the festival.
	 *   - AtatDayTime: The time of the third day of the festival.
	 *   - NewYearDay: The day of the New Year Day following the festival.
	 *   - akyatday2: A boolean indicating whether the third day of the festival
	 *     falls on the same day as the New Year Day.
	 */
	public thingyan(year: number, yearType?: "Burmese" | "Gregorian"): ThinGyan {
		const yt = yearType ?? "Gregorian";
		return yt === "Burmese"
			? this.thingyanDays(year)
			: this.thingyanFromG(year);
	}

	/**
	 * Gets the Burmese year type for the given year.
	 *
	 * The method takes a Burmese year and an optional language setting and
	 * returns the corresponding year type in the specified language.
	 *
	 * @param by - The Burmese year.
	 * @param lang - Optional language setting for the year type. Defaults to "English".
	 * @returns The Burmese year type in the specified language.
	 */
	public burmeseYearType(by: number, lang?: Language): string {
		const lan = lang ?? "English";
		const yt = B.getLeapYearData(by).myt;
		const byt = B.YearTypes[yt];
		return T.translateStr(byt ?? "", lan) as string;
	}
	/**
	 * Converts a given date and time to the Julian Date and Julian Day Number.
	 *
	 * This method takes a specified date and time, including the time zone,
	 * and calculates the corresponding Julian Date (jd) and Julian Day Number (jdn).
	 *
	 * @param year - The year of the date.
	 * @param month - The month of the date [1=Jan,...,12=Dec].
	 * @param day - The day of the month.
	 * @param hour - The hour of the day (default is 12).
	 * @param minutes - The minutes past the hour (default is 0).
	 * @param seconds - The seconds past the minute (default is 0).
	 * @param tz - The time zone of the date and time (default is "GMT").
	 * @returns An object containing:
	 *  - jd: The calculated Julian Date.
	 *  - jdn: The calculated Julian Day Number.
	 */

	public datetimeToJd({
		year,
		month,
		day,
		hour = 12,
		minutes = 0,
		seconds = 0,
		tz = "GMT",
	}: G2JOptions): {
		jd: number;
		jdn: number;
	} {
		return G.dt2jd({ year, month, day, hour, minutes, seconds, tz });
	}

	/**
	 * Converts a Julian Date (jd) to a datetime object.
	 * @param jd - The Julian Date to be converted.
	 * @param tz - Optional time zone setting for the datetime object. Defaults to "GMT".
	 * @returns An object with the year, month, day, hour, minutes and seconds of the datetime object.
	 */
	public jdToDatetime(
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
		return G.jd2dt(jd, tz);
	}
	/**
	 * Convert a date between Gregorian and Julian calendars.
	 *
	 * This method takes an object with the following properties:
	 *   - ct: The calendar type to convert to. Either "julian" or "gregorian".
	 *   - year: The year to be converted.
	 *   - month: The month to be converted [1=Jan,...,12=Dec].
	 *   - day: The day to be converted [1-31].
	 *
	 * The method returns an object with the year, month and day of the converted
	 * date.
	 */
	public calendarConverter({ ct, year, month, day }: CalendarConvertOptions): {
		year: number;
		month: number;
		day: number;
	} {
		return G.calC({ ct, year, month, day });
	}
}

export { BurmeseCal };
