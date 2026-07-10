// cSpell:disable
import { describe, it } from "node:test";
import { expectZoneInfo, expectZoneOffset } from "../tests_helpers.js";

describe("Time Zones Offset Tests", () => {
	it("Myanmar Time", () => {
		expectZoneOffset("Asia/Yangon", 6.5);
	});
	it("Thailand Time", () => {
		expectZoneOffset("Asia/Bangkok", 7);
	});
	it("Kathmandu Time only one tz extra 0:45 minutes", () => {
		expectZoneOffset("Asia/Kathmandu", 5.75);
	});
	it("UTC Time", () => {
		expectZoneOffset("UTC", 0);
	});
	it("GMT Time", () => {
		expectZoneOffset("GMT", 0);
	});
	it("Etc/GMT+12 Time", () => {
		expectZoneOffset("Etc/GMT+12", -12);
	});
	it("Etc/GMT+12 Time", () => {
		expectZoneOffset("Pacific/Kiritimati", +14);
	});
});

describe("Zone Info Tests", () => {
	it("Myanmar Time", () => {
		expectZoneInfo("Asia/Yangon");
	});
	it("Thailand Time", () => {
		expectZoneInfo("Asia/Bangkok");
	});
});
