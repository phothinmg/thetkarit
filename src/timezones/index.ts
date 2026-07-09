// cSpell:disable

import { _timeZones } from "./timezones.js";
import { type _TimeZonesInfo, _timeZonesInfo } from "./timezonesInfo.js";
import type { _TimeZone } from "./tztypes.js";

namespace tzone {
	export type TimeZone = _TimeZone;
	export type TimeZonesInfo = _TimeZonesInfo;
	export const timeZonesInfo: TimeZonesInfo[] = _timeZonesInfo;
	export const timeZones: TimeZone[] = _timeZones;
	/**
	 * Calculates the offset of the given time zone base on Javascript Date.
	 * @param timeZone The time zone to calculate the offset for.
	 * @returns The offset in hours between the given time zone and the local time zone.
	 */
	export function zoneOffset(timeZone: TimeZone): number {
		const now = new Date();
		const tzString = now.toLocaleString("en-US", { timeZone });
		const localString = now.toLocaleString("en-US");
		const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
		const offset = diff + now.getTimezoneOffset() / 60;

		return -offset;
	}

	export function zoneInfo(timeZone: TimeZone): TimeZonesInfo | undefined {
		let found = false;
		for (const tz of timeZonesInfo) {
			if (tz.names.includes(timeZone)) {
				found = true;
				return tz;
			}
		}
		if (!found) {
			console.error(`${timeZone} dose not exists.`);
		}
	}
}

export default tzone;
