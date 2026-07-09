// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import thetkarit from "../../src/index.js";

const cal = thetkarit.calendar;

describe("Burmese Calendar Day View Tests", () => {
	const dvOptions: thetkarit.DayViewOptions = {
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

describe("Burmese Calendar Month View Tests", () => {
	const mvOptions: thetkarit.MonthViewOptions = {
		year: 2026,
		month: 4,
		lang: "Burmese",
	};
	const mv = cal.monthView(mvOptions);

	it("returns the requested month with day views", () => {
		assert.deepEqual(mv.year.id, 2026);
		assert.deepEqual(mv.month.id, 4);
		assert.deepEqual(mv.month.days_in_month, 30);
		assert.deepEqual(mv.date_views.length, 30);
		assert.deepEqual(mv.date_views[0]?.jdn, 2461132);
		assert.deepEqual(mv.date_views[0]?.day.id, 1);
	});
});

describe("Burmese Calendar Year View Tests", () => {
	const yvOptions: thetkarit.YearViewOptions = {
		year: 2026,
		lang: "Burmese",
	};
	const yv = cal.yearView(yvOptions);

	it("returns the requested year with month views", () => {
		assert.deepEqual(yv.year.id, 2026);
		assert.deepEqual(yv.year.days_in_year, 365);
		assert.deepEqual(yv.month_views.length, 12);
		assert.deepEqual(yv.month_views[3]?.month.id, 4);
		assert.deepEqual(yv.month_views[3]?.month.days_in_month, 30);
		assert.deepEqual(yv.month_views[3]?.date_views[0]?.jdn, 2461132);
	});
});
