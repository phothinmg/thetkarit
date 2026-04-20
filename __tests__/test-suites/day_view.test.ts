// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import { BurmeseCal } from "../../src/index.js";
import type { DayViewOptions } from "../../src/types/index.js";

describe("Burmese Calendar Day View Tests", () => {
	const cal = new BurmeseCal();
	const dvOptions: DayViewOptions = {
		year: 2026,
		month: 4,
		day: 1,
		lang: "Burmese",
	};
	const dv = cal.dayView(dvOptions);
	it("Julian Day Number", () => {
		assert.deepEqual(dv.jdn, 2461132);
	});
	it("Sasana Year", () => {
		assert.deepEqual(dv.burmese_cal.sasana_year.id, 2569);
	});
	it("Burmese Year", () => {
		assert.deepEqual(dv.burmese_cal.burmese_year.id, 1387);
	});
	it("Burmese Month", () => {
		assert.deepEqual(dv.burmese_cal.burmese_month.index, 13);
	});
	it("Burmese Day", () => {
		assert.deepEqual(dv.burmese_cal.burmese_day.id, 15);
	});
	it("Moon Phase,Full Moon Day Of Tagu", () => {
		assert.deepEqual(dv.burmese_cal.moon_phase.index, 1);
	});
	it("Yatyarzar", () => {
		assert.deepEqual(dv.burmese_cal.yatyaza.index, 1);
	});
	it("Sabbath", () => {
		assert.deepEqual(dv.burmese_cal.sabbath.index, 1);
		assert.deepEqual(dv.burmese_cal.sabbath.school_holiday, false);
	});
	it("Translate", () => {
		assert.deepEqual(dv.burmese_cal.burmese_month.str, "နှောင်းတန်ခူး");
	});
});
