// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import Thetkarit from "../../src/index.js";

describe("Burmese Calendar Month View Tests", () => {
	const cal = new Thetkarit.BurmeseCalendar();
	const mvOptions: Thetkarit.MonthOptions = {
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
