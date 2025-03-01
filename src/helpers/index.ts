export const helpers = {
	secularDiff(y: number) {
		return Math.floor(y / 100) - Math.floor(y / 400) - 2;
	},
	/**
	 * Determine if a given year is a leap year.
	 * @param year The year to determine if it is a leap year.
	 * @returns True if the year is a leap year, False otherwise.
	 */
	isLeapYear(year: number): boolean {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	},
	/**
	 * Get the number of days in each month of a year, given the year.
	 * @param year The year for which to get the number of days in each month.
	 * @returns An array of length 12, where each element is the number of days in the corresponding month.
	 */
	daysInMonth(year: number): number[] {
		const ms: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		const ml: number[] = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		return helpers.isLeapYear(year) ? ml : ms;
	},
	/**
	 * Removes duplicate numbers from an array.
	 * @param obj An array of numbers.
	 * @returns A new array containing only unique numbers from the input array.
	 */
	uniqNumber(obj: number[]): number[] {
		return Array.from(new Set(obj));
	},
	/**
	 * Removes duplicate strings from an array.
	 * @param obj An array of strings.
	 * @returns A new array containing only unique strings from the input array.
	 */
	uniqString(obj: string[]): string[] {
		return Array.from(new Set(obj));
	},
	/**
	 * Weekday ID
	 * @param jd Julian Date
	 * @returns Weekday id [0=Sun , ... , 6 = Sat]
	 */
	weekdayId(jdn: number) {
		return (jdn + 1) % 7;
	},
	weekday_id(id: number) {
		return id === 6 ? 0 : id + 1;
	},
};
