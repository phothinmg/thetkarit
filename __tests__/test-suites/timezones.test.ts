// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import thetkarit from "../../src/index.js";

describe("Time Zones Offset Tests", () => {
	it("Myanmar Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("Asia/Yangon"), 6.5);
	});
	it("Thailand Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("Asia/Bangkok"), 7);
	});
	it("Kathmandu Time only one tz extra 0:45 minutes", () => {
		assert.deepEqual(thetkarit.zoneOffset("Asia/Kathmandu"), 5.75);
	});
	it("UTC Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("UTC"), 0);
	});
	it("GMT Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("GMT"), 0);
	});
	it("Etc/GMT+12 Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("Etc/GMT+12"), -12);
	});
	it("Etc/GMT+12 Time", () => {
		assert.deepEqual(thetkarit.zoneOffset("Pacific/Kiritimati"), +14);
	});
});

describe("Zone Info Tests", () => {
	it("Myanmar Time", () => {
		const mm = thetkarit.timeZonesInfo.find((z) =>
			z.names.includes("Asia/Yangon"),
		);
		assert.deepEqual(thetkarit.zoneInfo("Asia/Yangon"), mm);
	});
	it("Thailand Time", () => {
		const mm = thetkarit.timeZonesInfo.find((z) =>
			z.names.includes("Asia/Bangkok"),
		);
		assert.deepEqual(thetkarit.zoneInfo("Asia/Bangkok"), mm);
	});
});
