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
