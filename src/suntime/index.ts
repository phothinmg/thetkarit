// cSpell:disable
import tzone from "../timezones/index.js";

namespace stime {
	export interface SunTimesOptions {
		latitude: number;
		longitude: number;
		date: Date;
		timezone?: tzone.TimeZone;
	}

	export interface SunTimesResult {
		sunrise: string;
		sunset: string;
		daytime: string;
	}
	/**
	 * Converts a decimal time value to a formatted time string.
	 *
	 * @param decimalTime - The decimal time value to convert.
	 * @returns The formatted time string in the format "HH:MM:SS AM/PM".
	 */
	export function convertDecimalTime(decimalTime: number): string {
		// Extracting hours, minutes, and seconds
		const hours = Math.floor(decimalTime);
		const minutes = Math.floor((decimalTime - hours) * 60);
		const seconds = Math.floor(((decimalTime - hours) * 60 - minutes) * 60);

		// Formatting leading zeros
		let formattedHours = hours.toString().padStart(2, "0");
		const formattedMinutes = minutes.toString().padStart(2, "0");
		const formattedSeconds = seconds.toString().padStart(2, "0");

		// Determining AM/PM
		const ampm = hours >= 12 ? "PM" : "AM";

		// Adjusting hours for AM/PM format
		if (hours > 12) {
			formattedHours = (hours - 12).toString().padStart(2, "0");
		} else if (hours === 0) {
			formattedHours = "12";
		}

		// Combining the formatted values
		const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

		return formattedTime;
	}
	/**
	 * Calculates the time difference between two decimal times and returns the result in HH:MM:SS format.
	 *
	 * @param decimalTime1 The first decimal time value.
	 * @param decimalTime2 The second decimal time value.
	 * @returns The time difference between the two decimal times in HH:MM:SS format.
	 */
	export function timeDiff(decimalTime1: number, decimalTime2: number): string {
		// Convert decimal time to seconds
		const seconds1 = Math.floor(decimalTime1 * 3600);
		const seconds2 = Math.floor(decimalTime2 * 3600);

		// Calculate the time difference in seconds
		const diffSeconds = Math.abs(seconds1 - seconds2);

		// Convert the time difference back to decimal time
		const decimalDiff = diffSeconds / 3600;

		// Extracting hours, minutes, and seconds
		const hours = Math.floor(decimalDiff);
		const minutes = Math.floor((decimalDiff - hours) * 60);
		const seconds = Math.floor(((decimalDiff - hours) * 60 - minutes) * 60);

		// Formatting leading zeros
		const formattedHours = hours.toString().padStart(2, "0");
		const formattedMinutes = minutes.toString().padStart(2, "0");
		const formattedSeconds = seconds.toString().padStart(2, "0");

		// Combining the formatted values
		const formattedTimeDiff = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

		return formattedTimeDiff;
	}

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
	function suntime(
		latitude: number,
		longitude: number,
		date: Date,
		timezone?: tzone.TimeZone,
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
		const tz =
			timezone !== undefined
				? tzone.zoneOffset(timezone)
				: -date.getTimezoneOffset() / 60;
		const localRise = (utcRise + tz + 24) % 24;
		const localSet = (utcSet + tz + 24) % 24;

		return [localRise, localSet];
	}

	/**
	 * Computes the sunrise, sunset, and daytime duration for a given location and date.
	 *
	 * @param {SunTimesOptions} options - An object containing the latitude, longitude, date, and optional timezone.
	 * @returns {SunTimesResult} - An object containing the formatted sunrise, sunset, and daytime duration strings.
	 *
	 * The function uses the `suntime` function to calculate the decimal times for sunrise and sunset,
	 * which are then converted to formatted strings using `convertDecimalTime`. If the sun never rises
	 * or sets, the result will indicate "Never". If the times are not available, "N/A" is returned.
	 */

	export function suntimes(options: SunTimesOptions): SunTimesResult {
		const { latitude, longitude, date, timezone } = options;
		const [sunriseDecimal, sunsetDecimal] = suntime(
			latitude,
			longitude,
			date,
			timezone,
		);
		let sunrise: string;
		let sunset: string;
		let daytime: string;

		if (sunriseDecimal === null && sunsetDecimal === -1) {
			sunrise = "Never";
			sunset = "";
			daytime = "";
		} else if (sunriseDecimal === -1 && sunsetDecimal === null) {
			sunrise = "";
			sunset = "Never";
			daytime = "";
		} else if (sunriseDecimal !== null && sunsetDecimal !== null) {
			sunrise = convertDecimalTime(sunriseDecimal);
			sunset = convertDecimalTime(sunsetDecimal);
			daytime = timeDiff(sunriseDecimal, sunsetDecimal);
		} else {
			sunrise = "N/A";
			sunset = "N/A";
			daytime = "N/A";
		}

		return { sunrise, sunset, daytime };
	}
}

export default stime;
