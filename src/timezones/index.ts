import { timeZonesInfo } from "./timezoneInfo";
import type { TimeZones } from "./tztypes";

export type TimezoneInfo = {
	names: string[];
	countryCode: string;
	countryName: string;
	latitude: number;
	longitude: number;
	offsets: string[];
	currentOffset: number;
};
/**
 * Returns the current offset of the given time zone in hours.
 * @param timeZone The time zone to retrieve the current offset for.
 * @returns The current offset in hours.
 */
export function currentOffset(timeZone: TimeZones): number {
	const found = timeZonesInfo.find((i) =>
		i.names.includes(timeZone),
	) as TimezoneInfo;
	return found.currentOffset;
}
/**
 * Calculates the offset of the given time zone base on Javascript Date.
 * @param timeZone The time zone to calculate the offset for.
 * @returns The offset in hours between the given time zone and the local time zone.
 */
export function getOffset(timeZone: TimeZones): number {
	const now = new Date();
	const tzString = now.toLocaleString("en-US", { timeZone });
	const localString = now.toLocaleString("en-US");
	const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
	const offset = diff + now.getTimezoneOffset() / 60;

	return -offset;
}

/**
 * Retrieves the information for a specified time zone.
 * @param timeZone The time zone identifier to look up.
 * @returns The TimezoneInfo object for the specified time zone, or undefined if not found.
 */

export function getZoneInfo(timeZone: TimeZones): TimezoneInfo | undefined {
	return timeZonesInfo.find((i) => i.names.includes(timeZone));
}

/**
 * Retrieves all time zone information.
 * @returns An object containing the timeZonesInfo array and a json method to get the stringified version.
 */

export function getAll(): {
	timeZonesInfo: TimezoneInfo[];
	json: () => string;
} {
	return {
		timeZonesInfo,
		json: () => JSON.stringify(timeZonesInfo, null, 2),
	};
}
