// cSpell:disable

import { Bcal } from "./calendar/bcal/index.js";
import { BcTranslate } from "./calendar/bcal/translate/index.js";
import { Gcal } from "./calendar/gcal.js";
import Tcal from "./calendar/index.js";
import type { CTP } from "./calendar/types.js";
import { blankCells, numberRange } from "./calendar/ui/index.js";
import { type _MoonPhases, BcMoon } from "./moon/index.js";
import stime from "./suntime/index.js";
import tzone from "./timezones/index.js";

namespace thetkarit {
	// Types
	// tz
	export type TimeZone = tzone.TimeZone;
	export type TimeZonesInfo = tzone.TimeZonesInfo;
	// calendar
	export type YearViewObject = CTP.YearViewObject;
	export type YearViewOptions = CTP.YearViewOptions;
	export type MonthViewObject = CTP.MonthViewObject;
	export type MonthViewOptions = CTP.MonthViewOptions;
	export type DayViewObject = CTP.DayViewObject;
	export type DayViewOptions = CTP.DayViewOptions;
	export type CalendarTypes = CTP.CalendarTypes;
	export type Language = CTP.Language;
	export type CalendarConvertOptions = CTP.CalendarConvertOptions;
	export type G2JOptions = CTP.G2JOptions;
	// thingyan
	export type ThinGyan = CTP.ThinGyan;
	// moon
	export type MoonPhases = _MoonPhases;
	// sun
	export type SunTimesOptions = stime.SunTimesOptions;
	export type SunTimesResult = stime.SunTimesResult;
	// new calendar instances
	const G = new Gcal();
	const B = new Bcal();
	const T = new BcTranslate();
	export const calendar = new Tcal(G, B, T);
	export const ui = { blankCells, numberRange };
	export const zoneOffset = (tz: TimeZone): number => tzone.zoneOffset(tz);
	export const zoneInfo = (tz: TimeZone): TimeZonesInfo | undefined =>
		tzone.zoneInfo(tz);
	export const timeZones: TimeZone[] = tzone.timeZones;
	export const timeZonesInfo: TimeZonesInfo[] = tzone.timeZonesInfo;
	export const moon = new BcMoon();
	export const sunTimes = (options: SunTimesOptions): SunTimesResult =>
		stime.suntimes(options);
}

export default thetkarit;
