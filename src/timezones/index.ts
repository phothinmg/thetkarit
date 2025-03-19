import type { TimeZones } from "./tztypes";

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
