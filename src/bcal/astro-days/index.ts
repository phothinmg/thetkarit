interface AstroOpts {
	/**
	 * Burmese Year
	 */
	by: number;
	/**
	 * Burmese Month
	 */
	bm: number;
	/**
	 * Burmese Day [1-30]
	 */
	bd: number;
	/**
	 * Weekday ID [0-6] [0=Sat,...,6=Fri]
	 */
	wd: number;
	/**
	 * Length of Burmese Month
	 */
	lm: number;
}
export class BcAstro {
	public astroDays: string[];
	public sabbath: { index: number; str: string };
	public nagahle: { index: number; str: string };
	public mahabote: { index: number; str: string };
	public natkhat: { index: number; str: string };
	public yatyaza: { index: number; str: string };
	public pyathada: { index: number; str: string };
	private _bm: number;
	private _bd: number;
	private _wd: number;
	/**
	 * Construct BcAstro object
	 * @param {AstroOpts} opts
	 * @prop {number} by Burmese Year
	 * @prop {number} bm Burmese Month
	 * @prop {number} bd Burmese Day [1-30]
	 * @prop {number} wd Weekday ID [0-6] [0=Sat,...,6=Fri]
	 * @prop {number} lm Length of Burmese Month
	 */
	constructor({ by, bm, bd, wd, lm }: AstroOpts) {
		this._bm = bm;
		this._bd = bd;
		this._wd = wd;
		this.sabbath = this._sabbath(this._bd, lm);
		this.nagahle = this._nagahle(this._bm);
		this.mahabote = this._mahabote(by, this._wd);
		this.natkhat = this._natkhat(by);
		this.yatyaza = this._yatyaza(this._bm, this._wd);
		this.astroDays = this.astros();
		this.pyathada = this._pyathada(this._bm, this._wd);
	}
	/**
	 * Calculate Thamanyo
	 * @param bm Burmese month
	 * @param wd weekday id
	 */
	private thamanyo(bm: number, wd: number): number {
		const bmt: number = Math.floor(bm / 13);
		let bm1: number = (bm % 13) + bmt; // to 1-12 with month type
		if (bm1 <= 0) bm1 = 4; //first warso is considered warso (looks no need here)

		const m1: number = bm1 - 1 - Math.floor(bm1 / 9);
		const wd1: number = (m1 * 2 - Math.floor(m1 / 8)) % 7;
		const wd2: number = (wd + 7 - wd1) % 7;

		const thamanyo: number = wd2 <= 1 ? 1 : 0;

		return thamanyo;
	}
	/**
	 * Calculate Thamaphyu
	 * @param bd Burmese date [1-30]
	 * @param wd weekday id
	 */
	private thamaphyu(bd: number, wd: number): number {
		const mf: number = bd - 15 * Math.floor(bd / 16); // Calculate fortnight day [0-15]
		let thamaphyu = 0;
		const wda = [1, 2, 6, 6, 5, 6, 7];
		const wdb = [0, 1, 0, 0, 0, 3, 3];

		if (mf === wda[wd] || mf === wdb[wd] || (mf === 4 && wd === 5)) {
			thamaphyu = 1;
		}

		return thamaphyu;
	}
	/**
	 * Calculate Amyeittasote.
	 *
	 * Determines whether the given Burmese day (bd) and weekday id (wd) correspond
	 * to the Amyeittasote condition. The function calculates the day within a
	 * fortnight and checks if it matches a predefined pattern for the given weekday.
	 *
	 * @param bd - Burmese date [1-30]
	 * @param wd - Weekday ID [0-6] [0=Sat,...,6=Fri]
	 * @returns 1 if the Amyeittasote condition is met, otherwise 0
	 */
	private amyeittasote(bd: number, wd: number): number {
		const mf: number = bd - 15 * Math.floor(bd / 16); // Calculate fortnight day [0-15]
		const wda: number[] = [5, 8, 3, 7, 2, 4, 1];
		return mf === wda[wd] ? 1 : 0;
	}
	/**
	 * Calculate Warameittugyi.
	 *
	 * Determines whether the given Burmese day (bd) and weekday id (wd) correspond
	 * to the Warameittugyi condition. The function calculates the day within a
	 * fortnight and checks if it matches a predefined pattern for the given weekday.
	 *
	 * @param bd - Burmese date [1-30]
	 * @param wd - Weekday ID [0-6] [0=Sat,...,6=Fri]
	 * @returns 1 if the Warameittugyi condition is met, otherwise 0
	 */

	private warameittugyi(bd: number, wd: number): number {
		const mf: number = bd - 15 * Math.floor(bd / 16); //get fortnight day [0-15]
		const wda: number[] = [7, 1, 4, 8, 9, 6, 3];
		return mf === wda[wd] ? 1 : 0;
	}
	private warameittunge(bd: number, wd: number): number {
		const mf: number = bd - 15 * Math.floor(bd / 16); //get fortnight day [0-15]
		const wn: number = (wd + 6) % 7;
		return 12 - mf === wn ? 1 : 0;
	}
	private yatpote(bd: number, wd: number): number {
		const mf: number = bd - 15 * Math.floor(bd / 16); //get fortnight day [0-15]
		const wda: number[] = [8, 1, 4, 6, 9, 8, 7];
		return mf === wda[wd] ? 1 : 0;
	}
	private nagapor(bd: number, wd: number): number {
		const wda = [26, 21, 2, 10, 18, 2, 21];
		const wdb = [17, 19, 1, 0, 9, 0, 0];

		if (
			bd === wda[wd] ||
			bd === wdb[wd] ||
			(bd === 2 && wd === 1) ||
			((bd === 12 || bd === 4 || bd === 18) && wd === 2)
		) {
			return 1;
		}

		return 0;
	}
	private yatyotema(bm: number, bd: number): number {
		let bm1 = bm % 13 || 13; // Normalize month to 1-12
		if (bm1 <= 0) bm1 = 4; // Consider first warso as warso
		const mf: number = bd - 15 * Math.floor(bd / 16); // Get fortnight day [0-15]
		const m1 = bm1 % 2 ? bm1 : (bm1 + 9) % 12;
		const adjustedM1 = ((m1 + 4) % 12) + 1;
		const yatyotema = mf === adjustedM1 ? 1 : 0;
		return yatyotema;
	}
	private mahayatkyan(bm: number, bd: number): number {
		let bm1: number = bm;
		if (bm1 <= 0) bm1 = 4; // Adjust month if less than or equal to 0
		const mf: number = bd - 15 * Math.floor(bd / 16); // Calculate fortnight day [0-15]
		let mahayatkyan = 0;
		const m1 = ((Math.floor((bm1 % 12) / 2) + 4) % 6) + 1;
		if (mf === m1) mahayatkyan = 1;
		return mahayatkyan;
	}
	private shanyat(bm: number, bd: number): number {
		const bmt = Math.floor(bm / 13);
		let bm1 = (bm % 13) + bmt; // Adjust month to 1-12 range
		if (bm1 <= 0) bm1 = 4; // Consider first warso as warso
		const mf: number = bd - 15 * Math.floor(bd / 16); // Get day within a fortnight [0-15]
		const sya = [8, 8, 2, 2, 9, 3, 3, 5, 1, 4, 7, 4];
		const shanyat = mf === sya[bm1 - 1] ? 1 : 0;
		return shanyat;
	}

	/**
	 * Calculates the Sabbath.
	 * @param bd Burmese date [1-30]
	 * @param lm Length of Burmese Month
	 * @returns { index: number; str: string }
	 *  - index: Sabbath ID [0-2] [0=None, 1=Sabbath, 2=Sabbath Eve]
	 *  - str: Sabbath string representation
	 */
	private _sabbath(bd: number, lm: number): { index: number; str: string } {
		const a: string[] = ["", "Sabbath", "Sabbath Eve"];
		let s = 0;
		if (bd === 8 || bd === 15 || bd === 23 || bd === lm) s = 1;
		if (bd === 7 || bd === 14 || bd === 22 || bd === lm - 1) s = 2;
		return { index: s, str: a[s] };
	}
	/**
	 * Determine the direction of the Burmese naga according to the month.
	 *
	 * This function calculates and returns the direction associated with the
	 * given Burmese month (bm), based on traditional Burmese astrological
	 * beliefs. The direction is categorized into four cardinal directions.
	 *
	 * @param bm - Burmese month as a number.
	 * @returns An object with:
	 *  - index: The index representing the direction [0-3], corresponding to ["West", "North", "East", "South"].
	 *  - str: The string representation of the direction.
	 */

	private _nagahle(bm: number): { index: number; str: string } {
		const a: string[] = ["West", "North", "East", "South"];
		let m1: number = bm;
		if (bm <= 0) m1 = 4; //first warso is considered warso
		const b: number = Math.floor((m1 % 12) / 3);
		return { index: b, str: a[b] };
	}
	/**
	 * Calculates the Mahabote of the given Burmese year.
	 *
	 * Mahabote is a Burmese astrological concept that categorizes the day of the
	 * week with a specific name. The function takes a Burmese year (by) and a
	 * weekday ID (wd) as inputs and returns an object with the index and string
	 * representation of the Mahabote.
	 *
	 * @param by - Burmese year
	 * @param wd - Weekday ID [0-6]
	 * @returns { index: number; str: string }
	 *  - index: The index of the Mahabote [0-6]
	 *  - str: The string representation of the Mahabote
	 */
	private _mahabote(by: number, wd: number): { index: number; str: string } {
		const a: string[] = [
			"Binga",
			"Ahtun",
			"Yaza",
			"Adipati",
			"Marana",
			"Thike",
			"Puti",
		];
		const b: number = (by - wd) % 7;
		return { index: b, str: a[b] };
	}
	/**
	 * Calculates the Natkhat of the given Burmese year.
	 *
	 * Natkhat is a Burmese astrological concept that categorizes the year with a
	 * specific name. The function takes a Burmese year (by) as input and returns
	 * an object with the index and string representation of the Natkhat.
	 *
	 * @param by - Burmese year
	 * @returns { index: number; str: string }
	 *  - index: The index of the Natkhat [0-2]
	 *  - str: The string representation of the Natkhat
	 */
	private _natkhat(by: number): { index: number; str: string } {
		const a: string[] = ["Ogre", "Elf", "Human"];
		const b: number = by % 3;
		return { index: b, str: a[b] };
	}
	/**
	 * Calculates the Yatyaza day of the given Burmese month and weekday.
	 * @param bm Burmese month
	 * @param wd Weekday ID [0-6]
	 * @returns { index: number; str: string }
	 *  - index: The index of the Yatyaza [0-1] [0=None, 1=Yatyaza]
	 *  - str: The string representation of the Yatyaza
	 */
	private _yatyaza(bm: number, wd: number): { index: number; str: string } {
		const a: string[] = ["", "Yatyaza"];
		const m1: number = bm % 4;
		let y = 0;
		const wd1: number = Math.floor(m1 / 2) + 4;
		const wd2: number =
			(1 - Math.floor(m1 / 2) + (m1 % 2)) * (1 + 2 * (m1 % 2));
		if (wd === wd1 || wd === wd2) y = 1;
		return { index: y, str: a[y] };
	}
	/**
	 * Calculates the Pyathada day of the given Burmese month and weekday.
	 * @param bm Burmese month
	 * @param wd Weekday ID [0-6]
	 * @returns { index: number; str: string }
	 *  - index: The index of the Pyathada [0-2] [0=None, 1=Pyathada, 2=Afternoon Pyathada]
	 *  - str: The string representation of the Pyathada
	 */
	private _pyathada(bm: number, wd: number): { index: number; str: string } {
		const a: string[] = ["", "Pyathada", "Afternoon Pyathada"];
		const m1: number = bm % 4;
		let p = 0;
		const wda: number[] = [1, 3, 3, 0, 2, 1, 2];
		if (m1 === 0 && wd === 4) p = 2; //afternoon pyathada
		if (m1 === wda[wd]) p = 1;
		return { index: p, str: a[p] };
	}
	private astros() {
		const hs: string[] = [];
		if (this.thamanyo(this._bm, this._wd)) {
			hs.push("Thamanyo");
		}
		if (this.amyeittasote(this._bd, this._wd)) {
			hs.push("Amyeittasote");
		}
		if (this.warameittugyi(this._bd, this._wd)) {
			hs.push("Warameittugyi");
		}
		if (this.warameittunge(this._bd, this._wd)) {
			hs.push("Warameittunge");
		}
		if (this.yatpote(this._bd, this._wd)) {
			hs.push("Yatpote");
		}
		if (this.thamaphyu(this._bd, this._wd)) {
			hs.push("Thamaphyu");
		}
		if (this.nagapor(this._bd, this._wd)) {
			hs.push("Nagapor");
		}
		if (this.yatyotema(this._bm, this._bd)) {
			hs.push("Yatyotema");
		}
		if (this.mahayatkyan(this._bm, this._bd)) {
			hs.push("Mahayatkyan");
		}
		if (this.shanyat(this._bm, this._bd)) {
			hs.push("Shanyat");
		}
		return hs;
	}
}
