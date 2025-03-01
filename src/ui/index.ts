/**
 * Calculates the number of blank cells before and after a month in a calendar.
 *
 * @param weekdayId - The day of the week of the first day of the month, where
 *                    0 is Sunday, 1 is Monday, ..., 6 is Saturday.
 * @param daysInMonth - The number of days in the month.
 * @returns An object containing the number of blank cells before and after the
 *          month.
 * @example
 * const result = blankCells(3, 31);
 * console.log(result.before); // 3
 * console.log(result.after);  // 1
 */
export function blankCells(
	weekdayId: number,
	daysInMonth: number,
): { before: number; after: number } {
	const t = (weekdayId % 7) + daysInMonth;
	return {
		before: weekdayId % 7,
		after: t <= 35 ? Math.max(0, 35 - t) : Math.max(0, 42 - t),
	};
}
/**
 * Generates an array of numbers in a specified range.
 *
 * This function returns an array containing all the numbers from the `start`
 * value to the `end` value, inclusive. The `end` value must be greater than
 * the `start` value, otherwise an error is thrown.
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range, must be greater than `start`.
 * @returns An array of numbers from `start` to `end`.
 * @throws An error if `end` is not greater than `start`.
 */

export function numberRange(start: number, end: number): number[] {
	if (end <= start) {
		throw new Error("End must be greater than Start");
	}
	const length = end - start + 1;
	const na = Array(length);
	for (let i = 0; i < length; i++) {
		na[i] = start + i;
	}
	return na;
}
