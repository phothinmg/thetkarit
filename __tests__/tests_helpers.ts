import assert from "node:assert";
import { mock } from "node:test";
import thetkarit from "../src/index.js";

const burmeseLanguage = "Burmese" satisfies thetkarit.Language;

function withMockedDate<T>(
	t: { after: (fn: () => void) => void },
	isoDate: string,
	run: () => T,
): T {
	mock.timers.enable({ apis: ["Date"], now: new Date(isoDate) });
	t.after(() => mock.timers.reset());
	return run();
}

function burmeseDayViewOptions(
	overrides: Partial<thetkarit.DayViewOptions> = {},
): thetkarit.DayViewOptions {
	return {
		year: 2026,
		month: 4,
		day: 1,
		lang: burmeseLanguage,
		...overrides,
	};
}

function burmeseMonthViewOptions(
	overrides: Partial<thetkarit.MonthViewOptions> = {},
): thetkarit.MonthViewOptions {
	return {
		year: 2026,
		month: 4,
		lang: burmeseLanguage,
		...overrides,
	};
}

function burmeseYearViewOptions(
	overrides: Partial<thetkarit.YearViewOptions> = {},
): thetkarit.YearViewOptions {
	return {
		year: 2026,
		lang: burmeseLanguage,
		...overrides,
	};
}

function expectZoneOffset(timeZone: thetkarit.TimeZone, offset: number) {
	assert.deepEqual(thetkarit.zoneOffset(timeZone), offset);
}

function expectZoneInfo(timeZone: thetkarit.TimeZone) {
	const expected = thetkarit.timeZonesInfo.find((zone) =>
		zone.names.includes(timeZone),
	);
	assert.deepEqual(thetkarit.zoneInfo(timeZone), expected);
}
// biome-ignore lint/suspicious/noExplicitAny: reason we need any here
function sortObject(obj: any) {
	return Object.fromEntries(
		Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
	);
}

// biome-ignore lint/suspicious/noExplicitAny: reason we need any here
const isObject = (input: any) =>
	typeof input === "object" && !Array.isArray(input) && input !== null;
// biome-ignore lint/suspicious/noExplicitAny: reason we need any here
function expect(entry: any) {
	// biome-ignore lint/suspicious/noExplicitAny: reason we need any here
	const hasOwn = (input: any) => {
		if (!isObject(entry)) assert.fail(`${entry} is not an object`);
		assert.ok(Object.hasOwn(entry, input));
	};
	// biome-ignore lint/suspicious/noExplicitAny: reason we need any here
	const isInstanceOf = (input: any) => {
		if (typeof input === "string") {
			assert.ok(typeof entry === input);
		} else {
			assert.ok(entry instanceof input);
		}
	};
	const hasLength = (input: number) => {
		const length: number | undefined = isObject(entry)
			? Object.keys(entry).length
			: (entry?.length ?? undefined);
		if (length) {
			assert.ok(length >= input);
		} else {
			assert.fail(`${typeof entry}`);
		}
	};

	return { hasOwn, isInstanceOf, hasLength };
}

export {
	burmeseDayViewOptions,
	burmeseMonthViewOptions,
	burmeseYearViewOptions,
	expect,
	expectZoneInfo,
	expectZoneOffset,
	sortObject,
	withMockedDate,
};
