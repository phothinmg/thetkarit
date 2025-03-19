import { langs } from "./langs";
import type { Language } from "./types";

export class BcTranslate {
	/**
	 * Translates a number from 0-9 into a string based on the given language.
	 * If the language is English, the number is returned as is.
	 * If the language is not English, the number is translated into a string based on the Myanmer digits.
	 * @param a The number to translate.
	 * @param lang The language to translate the number into. Defaults to English.
	 * @returns The translated number as a string.
	 */
	public translateNum(a: number, lang?: Language): string | number {
		const l: Language = lang ?? "English";
		const b: string[] = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
		let r: number | string;
		if (l === "English") {
			r = a;
		} else {
			const aa: string[] = a.toString().split("");
			const bb: string[] = [];
			aa.map((i) => {
				const x: string = b[Number.parseInt(i)];
				bb.push(x);
			});
			r = bb.join("");
		}
		return r;
	}
	/**
	 * Translates a string or an array of strings based on the given language.
	 * If the language is English, the input string(s) are returned as is.
	 * If the language is not English, the string(s) are translated using the provided array.
	 *
	 * @param str The string or array of strings to translate.
	 * @param array A 2D array where each sub-array contains a pair of strings,
	 *              with the first element being the original string and the second the translated string.
	 * @param lang The language to translate the string(s) into. Defaults to English.
	 * @returns The translated string or array of strings.
	 */

	public translateStr(str: string | string[], lang?: Language) {
		const l: Language = lang ?? "English";
		let r: string | string[] = "";
		if (l === "English") {
			r = str;
		} else {
			if (Array.isArray(str)) {
				const y: string[] = [];
				str.map((i) => {
					const z = langs.filter((k) => k[0] === i);
					y.push(z[0][1]);
				});
				r = y;
			} else {
				const x = langs.find((i) => i[0] === str);
				r = x ? x[1] : "";
			}
		}
		return r;
	}
}
