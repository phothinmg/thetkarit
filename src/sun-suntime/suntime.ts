/**
 * Calculates the local sunrise and sunset times for a given date and location.
 *
 * Based on the algorithm by Rui Okada:
 * https://gist.github.com/ruiokada/b28076d4911820ddcbbc
 *
 * Computation references:
 * - https://en.wikipedia.org/wiki/Julian_day#Converting_Julian_or_Gregorian_calendar_date_to_Julian_Day_Number
 * - https://en.wikipedia.org/wiki/Sunrise_equation#Complete_calculation_on_Earth
 *
 * @param latitude - Latitude in degrees (south is negative).
 * @param longitude - Longitude in degrees (west is negative).
 * @param date - Date for which to calculate sunrise and sunset.
 * @param timezone - Optional timezone offset in hours (e.g., -8 for PST). Defaults to system timezone.
 * @returns [sunrise, sunset] - Local times in 24-hour float format (e.g., 6.5 = 6:30am). Returns [null, -1] if sun never rises, [-1, null] if sun never sets.
 *
 * @author Rui Okada
 * @copyright Rui Okada
 */
export default function suntime(
	latitude: number,
	longitude: number,
	date: Date,
	timezone?: number,
): [number | null, number | null] {
	const radians = Math.PI / 180;
	const degrees = 180 / Math.PI;

	// Julian day calculation
	const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
	const y = date.getFullYear() + 4800 - a;
	const m = date.getMonth() + 1 + 12 * a - 3;
	const jDay =
		date.getDate() +
		Math.floor((153 * m + 2) / 5) +
		365 * y +
		Math.floor(y / 4) -
		Math.floor(y / 100) +
		Math.floor(y / 400) -
		32045;

	// Solar calculations
	const nStar = jDay - 2451545.0009 - longitude / 360;
	const n = Math.round(nStar);
	const solarNoon = 2451545.0009 + longitude / 360 + n;
	const M = 356.047 + 0.9856002585 * n;
	const C =
		1.9148 * Math.sin(M * radians) +
		0.02 * Math.sin(2 * M * radians) +
		0.0003 * Math.sin(3 * M * radians);
	const L = (M + 102.9372 + C + 180) % 360;
	const jTransit =
		solarNoon +
		0.0053 * Math.sin(M * radians) -
		0.0069 * Math.sin(2 * L * radians);
	const decl =
		Math.asin(Math.sin(L * radians) * Math.sin(23.45 * radians)) * degrees;

	// Hour angle
	const cosOmega =
		(Math.sin(-0.83 * radians) -
			Math.sin(latitude * radians) * Math.sin(decl * radians)) /
		(Math.cos(latitude * radians) * Math.cos(decl * radians));

	// Sun never rises
	if (cosOmega > 1) return [null, -1];
	// Sun never sets
	if (cosOmega < -1) return [-1, null];

	const omega = Math.acos(cosOmega) * degrees;
	const jSet = jTransit + omega / 360;
	const jRise = jTransit - omega / 360;

	// UTC times
	const utcSet = 24 * (jSet - jDay) + 12;
	const utcRise = 24 * (jRise - jDay) + 12;

	// Timezone offset
	const tz = timezone !== undefined ? timezone : -date.getTimezoneOffset() / 60;
	const localRise = (utcRise + tz + 24) % 24;
	const localSet = (utcSet + tz + 24) % 24;

	return [localRise, localSet];
}
