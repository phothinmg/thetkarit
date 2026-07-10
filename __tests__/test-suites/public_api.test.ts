// cSpell:disable
import assert from "node:assert";
import { describe, it } from "node:test";
import thetkarit from "../../src/index.js";
import { withMockedDate } from "../tests_helpers.js";

describe("Calendar Utility Tests", () => {
	it("returns Thingyan dates for Gregorian year 2025", () => {
		assert.deepEqual(thetkarit.calendar.thingyan(2025), {
			YearFrom: 1386,
			YearTo: 1387,
			AkyoDay: "Sun, Apr 13, 2025",
			AkyaDayTime: "Mon, Apr 14, 2025, 06:37:21 AM",
			AkyatDay: "Tue, Apr 15, 2025",
			AkyatDay2: "",
			AtatDayTime: "Wed, Apr 16, 2025, 10:42:02 AM",
			NewYearDay: "Thu, Apr 17, 2025",
			akyatday2: false,
		});
	});

	it("converts between Gregorian and Julian calendars", () => {
		assert.deepEqual(
			thetkarit.calendar.calendarConverter({
				ct: "julian",
				year: 2025,
				month: 4,
				day: 17,
			}),
			{ year: 2025, month: 4, day: 4 },
		);

		assert.deepEqual(
			thetkarit.calendar.calendarConverter({
				ct: "gregorian",
				year: 2025,
				month: 4,
				day: 4,
			}),
			{ year: 2025, month: 4, day: 17 },
		);
	});

	it("returns the Burmese year type in English", () => {
		assert.deepEqual(
			thetkarit.calendar.burmeseYearType(1386, "English"),
			"Common Year",
		);
	});

	it("round-trips a Yangon datetime through Julian date conversion", () => {
		// This flow asserts both directions of the conversion API from one anchor
		// value so failures show whether the regression is in `datetimeToJd` or
		// `jdToDatetime`.
		const jd = thetkarit.calendar.datetimeToJd({
			year: 2025,
			month: 4,
			day: 17,
			hour: 12,
			tz: "Asia/Yangon",
		});

		assert.deepEqual(jd, {
			jd: 2460783.2708333335,
			jdn: 2460783,
		});

		assert.deepEqual(thetkarit.calendar.jdToDatetime(jd.jd, "Asia/Yangon"), {
			year: 2025,
			month: 4,
			day: 18,
			hour: 1,
			minutes: 0,
			seconds: 0,
		});
	});

	it("applies timezone offsets when converting the same civil time", () => {
		// Same wall-clock time in different time zones should produce different JDs
		// while still mapping back to the expected local datetime for that zone.
		assert.deepEqual(
			thetkarit.calendar.datetimeToJd({
				year: 2025,
				month: 4,
				day: 17,
				hour: 12,
				tz: "UTC",
			}),
			{
				jd: 2460783,
				jdn: 2460783,
			},
		);

		assert.deepEqual(thetkarit.calendar.jdToDatetime(2460783.5, "UTC"), {
			year: 2025,
			month: 4,
			day: 18,
			hour: 0,
			minutes: 0,
			seconds: 0,
		});

		assert.deepEqual(
			thetkarit.calendar.jdToDatetime(2460783.5, "Asia/Yangon"),
			{
				year: 2025,
				month: 4,
				day: 18,
				hour: 6,
				minutes: 30,
				seconds: 0,
			},
		);
	});
});

describe("Moon Utility Tests", () => {
	it("returns numeric moon phase dates for a zero-based month", () => {
		assert.deepEqual(thetkarit.moon.moonPhases(2025, 8), {
			newMoon: 2460910.7552977805,
			firstQuarter: 2460918.768218846,
			fullMoon: 2460926.256949714,
			lastQuarter: 2460932.9403944733,
		});
	});

	it("returns formatted moon phase strings", () => {
		assert.deepEqual(thetkarit.moon.moonPhaseStr(2025, 8), {
			newMoon: "Aug 23 , 2025 , 06:07:37",
			firstQuarter: "Aug 31 , 2025 , 06:26:14",
			fullMoon: "Sep 7 , 2025 , 18:10:00",
			lastQuarter: "Sep 14 , 2025 , 10:34:10",
		});
	});

	it("returns the first full moon dates for the year in a timezone", () => {
		assert.deepEqual(
			thetkarit.moon.fullmoonDay(2025, "Asia/Yangon").slice(0, 3),
			[
				"Jan 14 , 2025 , 04:58:05",
				"Feb 12 , 2025 , 20:24:34",
				"Mar 14 , 2025 , 13:25:46",
			],
		);
	});

	it("returns moon age details for a fixed current date without throwing", (t) => {
		// `moonAge()` depends on the current date, so pin time to keep the test
		// deterministic and to make regressions reproducible.
		const result = withMockedDate(t, "2026-07-10T12:25:02Z", () =>
			thetkarit.moon.moonAge("Asia/Yangon"),
		);

		assert.ok(result.duration > 20);
		assert.ok(result.duration < 35);
		assert.ok(result.moonAge >= 0);
		assert.ok(result.moonAge <= result.duration);
		assert.match(result.previousNewMoon, /2026/);
		assert.match(result.nextNewMoon, /2026/);
		assert.match(result.fullMoon, /2026/);
	});

	it("tracks the previous and next new moon across the January boundary", (t) => {
		assert.deepEqual(
			withMockedDate(t, "2026-01-10T12:00:00Z", () =>
				thetkarit.moon.moonAge("Asia/Yangon"),
			),
			{
				duration: 29.756012266501784,
				moonAge: 21.42735458398238,
				previousNewMoon: "Dec 20 , 2025 , 14:44:36",
				nextNewMoon: "Jan 19 , 2026 , 08:53:16",
				fullMoon: "Jan 3 , 2026 , 23:04:05",
			},
		);
	});

	it("keeps the same lunation window at the December to January rollover", (t) => {
		assert.deepEqual(
			withMockedDate(t, "2025-12-31T18:00:00Z", () =>
				thetkarit.moon.moonAge("Asia/Yangon"),
			),
			{
				duration: 29.756012266501784,
				moonAge: 11.677354583982378,
				previousNewMoon: "Dec 20 , 2025 , 14:44:36",
				nextNewMoon: "Jan 19 , 2026 , 08:53:16",
				fullMoon: "Jan 3 , 2026 , 23:04:05",
			},
		);
	});
});

describe("Sun Time Utility Tests", () => {
	it("returns formatted sunrise, sunset, and daytime strings", () => {
		assert.deepEqual(
			thetkarit.sunTimes({
				latitude: 16.8661,
				longitude: 96.1951,
				date: new Date("2025-02-12T00:00:00Z"),
				timezone: "Asia/Yangon",
			}),
			{
				sunrise: "07:24:21 PM",
				sunset: "06:56:26 AM",
				daytime: "12:27:55",
			},
		);
	});
});

describe("UI Helper Tests", () => {
	it("calculates blank cells for a 31-day month starting on Wednesday", () => {
		// This mirrors a typical month-grid layout: 31 visible days plus one trailing
		// blank cell to finish the final week row.
		assert.deepEqual(thetkarit.ui.blankCells(3, 31), {
			before: 3,
			after: 1,
		});
	});

	it("creates an inclusive numeric range", () => {
		assert.deepEqual(thetkarit.ui.numberRange(1, 5), [1, 2, 3, 4, 5]);
	});

	it("throws when the end of the range is not greater than the start", () => {
		assert.throws(
			() => thetkarit.ui.numberRange(5, 5),
			/End must be greater than Start/,
		);
	});
});
