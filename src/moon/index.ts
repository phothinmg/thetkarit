// cSpell:disable
import { Gcal } from "../calendar/gcal.js";
import tzone from "../timezones/index.js";

const G = new Gcal();

//
/**
 * phase:
 *  0 = new ,
 *  0.25 = first quarter ,
 *  0.5 = full ,
 *  0.75 = last quarter ,
 *  all other values are invalid
 */
type _MoonPhases = 0 | 0.25 | 0.5 | 0.75;

class BcMoon {
	/**
	 * Normalize an angle to the range of 0 to 359 degrees.
	 *
	 * This function takes a number representing an angle and returns its equivalent
	 * angle within the range of 0 to 359 degrees by performing a modulus operation.
	 * If the resulting angle is negative, it adjusts to ensure a positive value.
	 *
	 * @param f - The angle in degrees to be normalized.
	 * @returns The normalized angle within the range of 0 to 359 degrees.
	 */
	private mod360(f: number) {
		let t = f % 360;
		if (t < 0) t += 360;
		return t;
	}
	/**
	 * Calculate the cycle number for a given month and year.
	 *
	 * The cycle number is used to find the moon phase. It is calculated by estimating
	 * the fraction of the year represented by the given month and adding it to the
	 * given year. The result is then multiplied by 12.3685 and subtracted by 2000.
	 *
	 * @param year - The year.
	 * @param month - The month, 1-12.
	 * @returns The cycle number.
	 */
	private getCycle(year: number, month: number) {
		const yf = (month * 30 + 15) / 365; //Estimate fraction of year
		const k = 12.3685 * (year + yf - 2000);
		return Math.floor(k);
	}
	/**
	 * Calculate the Julian Ephemeris Day (JED) for a given moon phase in a specific cycle.
	 *
	 * Greg Miller gmiller@gregmiller.net
	 * Algorithm from Meeus Astronomical Algorithms for computing dates of moon phases
	 *
	 *
	 * This function computes the Julian Ephemeris Day (JED) for a specified moon phase
	 * (new moon, first quarter, full moon, or last quarter) within a given cycle number.
	 * The calculations are based on formulas from Jean Meeus's Astronomical Algorithms.
	 * The function accounts for various astronomical parameters and corrections to
	 * accurately determine the JED for the specified phase.
	 *
	 * @param cycle - The cycle number for which to calculate the moon phase.
	 * @param phase - The moon phase to calculate (0 = new, 0.25 = first quarter,
	 *                0.5 = full, 0.75 = last quarter).
	 * @returns The Julian Ephemeris Day (JED) corresponding to the specified moon phase
	 *          within the given cycle.
	 */
	private phaseDate(cycle: number, phase: _MoonPhases): number {
		//From Meeus ch49
		const k = cycle + phase;

		const toRad = Math.PI / 180;

		const T = k / 1236.85; //49.3

		let JDE =
			2451550.09766 +
			29.530588861 * k +
			0.00015437 * T * T -
			0.00000015 * T * T * T +
			0.00000000073 * T * T * T * T; //49.1

		const E = 1 - 0.002516 * T - 0.0000074 * T * T; //47.6

		const M =
			this.mod360(
				2.5534 + 29.1053567 * k - 0.0000014 * T * T - 0.00000011 * T * T * T,
			) * toRad; //49.4
		const Mp =
			this.mod360(
				201.5643 +
					385.81693528 * k +
					0.0107582 * T * T +
					0.00001238 * T * T * T -
					0.000000058 * T * T * T * T,
			) * toRad; //49.5
		const F =
			this.mod360(
				160.7108 +
					390.67050284 * k -
					0.0016118 * T * T -
					0.00000227 * T * T * T +
					0.000000011 * T * T * T * T,
			) * toRad; //49.6
		const Om =
			this.mod360(
				124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T * T * T,
			) * toRad; //49.7
		//P351-352
		const A1 = this.mod360(299.77 + 0.107408 * k - 0.009173 * T * T) * toRad;
		const A2 = this.mod360(251.88 + 0.016321 * k) * toRad;
		const A3 = this.mod360(251.83 + 26.651886 * k) * toRad;
		const A4 = this.mod360(349.42 + 36.412478 * k) * toRad;
		const A5 = this.mod360(84.66 + 18.206239 * k) * toRad;
		const A6 = this.mod360(141.74 + 53.303771 * k) * toRad;
		const A7 = this.mod360(207.14 + 2.453732 * k) * toRad;
		const A8 = this.mod360(154.84 + 7.30686 * k) * toRad;
		const A9 = this.mod360(34.52 + 27.261239 * k) * toRad;
		const A10 = this.mod360(207.19 + 0.121824 * k) * toRad;
		const A11 = this.mod360(291.34 + 1.844379 * k) * toRad;
		const A12 = this.mod360(161.72 + 24.198154 * k) * toRad;
		const A13 = this.mod360(239.56 + 25.513099 * k) * toRad;
		const A14 = this.mod360(331.55 + 3.592518 * k) * toRad;

		let correction = 0;
		if (phase === 0) {
			correction =
				0.00002 * Math.sin(4 * Mp) +
				-0.00002 * Math.sin(3 * Mp + M) +
				-0.00002 * Math.sin(Mp - M - 2 * F) +
				0.00003 * Math.sin(Mp - M + 2 * F) +
				-0.00003 * Math.sin(Mp + M + 2 * F) +
				0.00003 * Math.sin(2 * Mp + 2 * F) +
				0.00003 * Math.sin(Mp + M - 2 * F) +
				0.00004 * Math.sin(3 * M) +
				0.00004 * Math.sin(2 * Mp - 2 * F) +
				-0.00007 * Math.sin(Mp + 2 * M) +
				-0.00017 * Math.sin(Om) +
				-0.00024 * E * Math.sin(2 * Mp - M) +
				0.00038 * E * Math.sin(M - 2 * F) +
				0.00042 * E * Math.sin(M + 2 * F) +
				-0.00042 * Math.sin(3 * Mp) +
				0.00056 * E * Math.sin(2 * Mp + M) +
				-0.00057 * Math.sin(Mp + 2 * F) +
				-0.00111 * Math.sin(Mp - 2 * F) +
				0.00208 * E * E * Math.sin(2 * M) +
				-0.00514 * E * Math.sin(Mp + M) +
				0.00739 * E * Math.sin(Mp - M) +
				0.01039 * Math.sin(2 * F) +
				0.01608 * Math.sin(2 * Mp) +
				0.17241 * E * Math.sin(M) +
				-0.4072 * Math.sin(Mp);
		} else if (phase === 0.25 || phase === 0.75) {
			correction =
				-0.00002 * Math.sin(3 * Mp + M) +
				0.00002 * Math.sin(Mp - M + 2 * F) +
				0.00002 * Math.sin(2 * Mp - 2 * F) +
				0.00003 * Math.sin(3 * M) +
				0.00003 * Math.sin(Mp + M - 2 * F) +
				0.00004 * Math.sin(Mp - 2 * M) +
				-0.00004 * Math.sin(Mp + M + 2 * F) +
				0.00004 * Math.sin(2 * Mp + 2 * F) +
				-0.00005 * Math.sin(Mp - M - 2 * F) +
				-0.00017 * Math.sin(Om) +
				0.00027 * E * Math.sin(2 * Mp + M) +
				-0.00028 * E * E * Math.sin(Mp + 2 * M) +
				0.00032 * E * Math.sin(M - 2 * F) +
				0.00032 * E * Math.sin(M + 2 * F) +
				-0.00034 * E * Math.sin(2 * Mp - M) +
				-0.0004 * Math.sin(3 * Mp) +
				-0.0007 * Math.sin(Mp + 2 * F) +
				-0.0018 * Math.sin(Mp - 2 * F) +
				0.00204 * E * E * Math.sin(2 * M) +
				0.00454 * E * Math.sin(Mp - M) +
				0.00804 * Math.sin(2 * F) +
				0.00862 * Math.sin(2 * Mp) +
				-0.01183 * E * Math.sin(Mp + M) +
				0.17172 * E * Math.sin(M) +
				-0.62801 * Math.sin(Mp);

			const W =
				0.00306 -
				0.00038 * E * Math.cos(M) +
				0.00026 * Math.cos(Mp) -
				0.00002 * Math.cos(Mp - M) +
				0.00002 * Math.cos(Mp + M) +
				0.00002 * Math.cos(2 * F);
			if (phase === 0.25) {
				correction += W;
			} else {
				correction -= W;
			}
		} else if (phase === 0.5) {
			correction =
				0.00002 * Math.sin(4 * Mp) +
				-0.00002 * Math.sin(3 * Mp + M) +
				-0.00002 * Math.sin(Mp - M - 2 * F) +
				0.00003 * Math.sin(Mp - M + 2 * F) +
				-0.00003 * Math.sin(Mp + M + 2 * F) +
				0.00003 * Math.sin(2 * Mp + 2 * F) +
				0.00003 * Math.sin(Mp + M - 2 * F) +
				0.00004 * Math.sin(3 * M) +
				0.00004 * Math.sin(2 * Mp - 2 * F) +
				-0.00007 * Math.sin(Mp + 2 * M) +
				-0.00017 * Math.sin(Om) +
				-0.00024 * E * Math.sin(2 * Mp - M) +
				0.00038 * E * Math.sin(M - 2 * F) +
				0.00042 * E * Math.sin(M + 2 * F) +
				-0.00042 * Math.sin(3 * Mp) +
				0.00056 * E * Math.sin(2 * Mp + M) +
				-0.00057 * Math.sin(Mp + 2 * F) +
				-0.00111 * Math.sin(Mp - 2 * F) +
				0.00209 * E * E * Math.sin(2 * M) +
				-0.00514 * E * Math.sin(Mp + M) +
				0.00734 * E * Math.sin(Mp - M) +
				0.01043 * Math.sin(2 * F) +
				0.01614 * Math.sin(2 * Mp) +
				0.17302 * E * Math.sin(M) +
				-0.40614 * Math.sin(Mp);
		}

		JDE += correction;

		//Additional corrections P 252
		correction =
			0.000325 * Math.sin(A1) +
			0.000165 * Math.sin(A2) +
			0.000164 * Math.sin(A3) +
			0.000126 * Math.sin(A4) +
			0.00011 * Math.sin(A5) +
			0.000062 * Math.sin(A6) +
			0.00006 * Math.sin(A7) +
			0.000056 * Math.sin(A8) +
			0.000047 * Math.sin(A9) +
			0.000042 * Math.sin(A10) +
			0.00004 * Math.sin(A11) +
			0.000037 * Math.sin(A12) +
			0.000035 * Math.sin(A13) +
			0.000023 * Math.sin(A14);

		JDE += correction;

		return JDE;
	}
	/**
	 * Calculate the Julian Date of different moon phases for a given year and month.
	 *
	 * This function computes the Julian Date for the new moon, first quarter, full moon,
	 * and last quarter phases of the moon for a specific year and month.
	 *
	 * @param year - The year for which the moon phases are calculated.
	 * @param month - The month (0-indexed) for which the moon phases are calculated.
	 * @returns An object containing the Julian Dates for the new moon, first quarter,
	 *          full moon, and last quarter phases.
	 */
	public moonPhases(year: number, month: number) {
		const cy: number = this.getCycle(year, month);
		const _n: number = this.phaseDate(cy, 0);
		const _fst: number = this.phaseDate(cy, 0.25);
		const _ful: number = this.phaseDate(cy, 0.5);
		const _lst: number = this.phaseDate(cy, 0.75);
		return {
			newMoon: _n,
			firstQuarter: _fst,
			fullMoon: _ful,
			lastQuarter: _lst,
		};
	}
	/**
	 * Compute the dates of full moon for the given year and timezone.
	 *
	 * @param year - The year to compute the full moon dates for.
	 * @param tz - Optional timezone string. Defaults to "Asia/Yangon".
	 * @returns An array of 12 strings, each representing the date of the full moon for each month of the year.
	 */
	public fullmoonDay(year: number, tz?: tzone.TimeZone): string[] {
		const ttz: tzone.TimeZone = tz ?? "GMT";
		const phases = new Array(12)
			.fill(0)
			.map((_, i) => this.moonPhases(year, i));
		return phases.map((p) => G.jd2dtStr(p.fullMoon, ttz));
	}
	/**
	 * Return the moon age in days, length of month, previous and next new moon days in strings,
	 * and the full moon day in string.
	 * @param tz - Optional time zone. Defaults to "GMT".
	 * @returns Object containing duration, moon age, previous and next new moon days,
	 * and the full moon day.
	 */
	public moonAge(tz?: tzone.TimeZone): {
		duration: number;
		moonAge: number;
		previousNewMoon: string;
		nextNewMoon: string;
		fullMoon: string;
	} {
		const _tzz = tz ?? "GMT";
		// tz offset of this to fraction of day
		const df = tzone.zoneOffset(_tzz) / 24;
		// set time zone as GMT
		const y = G.utcDtNow().year;
		const rm = G.utcDtNow().month + 1;
		// last and next month
		const pm = rm - 1;
		const nm = rm + 1;
		// sometime 2 new moon days in one month , store nm to an array
		// recent month NMs
		const rnms: number[] = [];
		rnms.push(this.moonPhases(y, rm).newMoon);
		// prev month NMs
		const pnms: number[] = [];
		pnms.push(this.moonPhases(y, pm).newMoon);
		// next month NMs
		const nnms: number[] = [];
		nnms.push(this.moonPhases(y, nm).newMoon);
		// set jd for now , utc + tz fraction of this

		const jdnow = G.jdUtcNow() + df;
		// find previous and next new moon days as ,jd
		const nm1: number | undefined = rnms.find((i) => i < jdnow);
		const nm2: number | undefined = rnms.find((i) => i > jdnow);
		const nm3: number =
			pnms.length > 1 ? (pnms[1] as number) : (pnms[0] as number);
		const nm4: number = nnms[0] as number;
		// previous
		const pn_m: number = nm1 ? nm1 : nm3;
		const p_n_m: number = pn_m + df;
		// next
		const nn_m: number = nm2 ? nm2 : nm4;
		const n_n_m: number = nn_m + df;
		//TODO length of month
		const l_m: number = n_n_m - p_n_m;
		// moon age now
		if (jdnow < p_n_m) {
			throw new Error(
				`JdNow : ${jdnow} ${G.jd2dtStr(
					jdnow,
					_tzz,
				)} must greater than PNM : ${p_n_m} ${G.jd2dtStr(p_n_m, _tzz)}`,
			);
		}
		const man = jdnow - p_n_m;
		// find full moon
		const fma: number[] = [];
		for (let i = pm; i <= nm; i++) {
			fma.push(this.moonPhases(y, i).fullMoon + df);
		}
		let fm = 0;
		for (const f of fma) {
			if (f > p_n_m && f < n_n_m) {
				fm = f;
			}
		}
		// string of fm, pnm and nnm
		const fmStr = G.jd2dtStr(fm, _tzz);
		const pnmStr = G.jd2dtStr(p_n_m, _tzz);
		const nnmStr = G.jd2dtStr(n_n_m, _tzz);
		//return { l_m, man, pnmStr, nnmStr, fmStr };
		return {
			duration: l_m,
			moonAge: man,
			previousNewMoon: pnmStr,
			nextNewMoon: nnmStr,
			fullMoon: fmStr,
		};
	}
	/**
	 * Get string representations of moon phase dates for a given month and year.
	 *
	 * This function calculates the dates of the new moon, first quarter,
	 * full moon, and last quarter for the specified year and month, and
	 * returns them as formatted string representations.
	 *
	 * @param year - The year for which to calculate moon phases.
	 * @param month - The month for which to calculate moon phases.
	 * @returns An object containing the string representations of the
	 * new moon, first quarter, full moon, and last quarter dates.
	 */
	public moonPhaseStr(year: number, month: number) {
		const mps = this.moonPhases(year, month);
		return {
			newMoon: G.jd2dtStr(mps.newMoon),
			firstQuarter: G.jd2dtStr(mps.firstQuarter),
			fullMoon: G.jd2dtStr(mps.fullMoon),
			lastQuarter: G.jd2dtStr(mps.lastQuarter),
		};
	}
	/**
	 * A more recent lunation number (called the Lunation Number) was introduced by Jean Meeus in 1998.
	 * Lunation 0 as beginning on the first new moon of 2000 (this occurred at approximately 18:14 UTC, 6 January 2000).
	 *
	 * @param year - The year for which to calculate moon phases.
	 * @param month - The month for which to calculate moon phases [0=Jan,...,11=Dec]
	 * @returns - Meenus Lunation Number [LN]
	 */
	public meenusLunationNumber(year: number, month: number): number {
		return this.getCycle(year, month);
	}
	/**
	 * Brown Lunation Number (BLN) by Ernest William Brown.
	 * Lunation 1 occurred at approximately 02:41 UTC, 17 January 1923.
	 *
	 * @param year - The year for which to calculate moon phases.
	 * @param month  - The month for which to calculate moon phases [0=Jan,...,11=Dec]
	 * @returns - Brown Lunation Number [BLN] [BLN = LN + 953]
	 */
	public brownLunationNumber(year: number, month: number): number {
		return this.getCycle(year, month) + 953;
	}
	/**
	 * The Thai Lunation Number is called "มาสเกณฑ์" (Maasa-Kendha),
	 * defines lunation 0 as the beginning of Burmese era of the Buddhist calendar on Sunday, 22 March 638 CE.
	 *
	 * @param year - The year for which to calculate moon phases.
	 * @param month  - The month for which to calculate moon phases [0=Jan,...,11=Dec]
	 * @returns Thai Lunation Number [TLN] [TLN = LN + 16843]
	 */
	public thaiLunationNumber(year: number, month: number): number {
		return this.getCycle(year, month) + 16843;
	}
}

export type { _MoonPhases };
export { BcMoon };
