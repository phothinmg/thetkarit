import assert from "node:assert";
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

export { sortObject, expect };
