// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import Thetkarit from "../../src/index.js";

describe("Burmese Calendar Year View Tests", () => {
	const cal = new Thetkarit.BurmeseCalendar();
	const yvOptions: Thetkarit.YearOptions = {
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
