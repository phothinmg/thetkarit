import { FME, WTE } from "./exceptions";

type GetWoNm = {
	/**
	 * warhtat offset to compensate
	 */
	WO: number;
	/**
	 * Number of months to find excess days
	 */
	NM: number;
};
type GetLeapYearData = {
	/**
	 * Myanmar Year Type
	 *
	 * 0=common, 1=little warhtat, 2=big warhtat
	 *
	 */
	myt: number;
	/**
	 * The 1st day of Tagu as Julian Day Number for MMT
	 */
	tg1: number;
	/**
	 * Full moon day of [2nd] Warso as Julian Day Number
	 */
	fm: number;
	/**
	 * Warhtat discrepancy
	 *
	 * 0 = ok, 1= error
	 */
	err: number;
};
type EraIds = 1.1 | 1.2 | 1.3 | 2 | 3;
export type JTB = {
	/**
	 * Burmese Year Types
	 * 0=common, 1=little warhtat, 2=big warhtat
	 */
	yt: number;
	/**
	 * Sasana Year
	 */
	ssy: number;
	/**
	 * Burmese Year
	 */
	by: number;
	/**
	 * Burmese Month
	 */
	bm: number;
	/**
	 * Burmese Month String
	 */
	bm_str: string;
	/**
	 * Burmese Month Type
	 */
	bmt: number;
	/**
	 * Burmese Month Length
	 */
	bml: number;
	/**
	 * Burmese Day
	 */
	bd: number;
	/**
	 * Fortnight Day
	 */
	fd: number;
	/**
	 * Moon Phase
	 * [0=waxing, 1=full moon, 2=waning, 3=new moon]
	 */
	mp: number;
	/**
	 * Moon Phase String
	 */
	mp_str: string;
	warDwin: boolean;
};

// calendar calculation
export class BcCal {
	/**
	 * The length of a solar year in the Burmese calendar is defined as 1577917828/4320000 (365.2587565) days [Irwin, 1909].
	 */
	protected SY: number = 1577917828 / 4320000;
	/**
	 * The length of a lunar month in the Burmese calendar is defined as 1577917828/53433336 (29.53058795) days [Irwin, 1909].
	 */
	protected LM: number = 1577917828 / 53433336;
	/**
	 * Estimated Julian Date value of the starting time of the Burmese year zero [Yan Naing Aye,2013]
	 */
	protected MO = 1954168.050623;
	/**
	 * List of Myanmer month name
	 */
	protected BurmeseMonthName: string[] = [
		"First Waso",
		"Tagu",
		"Kason",
		"Nayon",
		"Waso",
		"Wagaung",
		"Tawthalin",
		"Thadingyut",
		"Tazaungmon",
		"Nadaw",
		"Pyatho",
		"Tabodwe",
		"Tabaung",
		"Late Tagu",
		"Late Kason",
	];
	/**
	 * Moon Phases
	 */
	protected MoonPhase: string[] = ["Waxing", "Full Moon", "Waning", "New Moon"];
	/**
	 * ဝါဆိုညှိကိန်း WO အတွက် ရှာလိုသောမြန်မာနှစ် FME တွင်ပါမပါ ပါလျင် ကွဲလွဲသောနှစ်အရေအတွက်အား ရရှိမည့် လုပ်ဆောင်ချက်ဖြစ်သည်။
	 *
	 * Is the Myanmar Year include in FME? If include, the function returns number years of different , else returns 0.
	 *
	 * ရလဒ်အား ဝါဆိုညှိကိန်းတွင်သွားပေါင်းမည်ဖြစ်သဖြငိ့ ဇယားတွင်မပါပါက အဖြေ သုည သတ်မှတ်ထားပါသည်။
	 *
	 * @param by Burmese Year
	 * @returns ကွဲလွဲသောနှစ်အရေအတွက်
	 */
	protected searchFme(by: number): number {
		const found: number[] | undefined = FME.find((i: number[]) => i[0] === by);
		let result = 0;
		if (found !== undefined) {
			result = found[1];
		}
		return result;
	}
	/**
	 * Checks if a given year is valid.
	 * A valid year is a year that is non-negative,
	 * an integer, and has a string representation of length 4 or less.
	 * @param by The Burmese year to check
	 * @returns If the year is valid
	 */
	protected validYear = (by: number): boolean => {
		const is4 = by.toString().split("").length <= 4;
		return by >= 0 && Number.isInteger(by) && is4;
	};
	/**
	 * Burmese Year to Kali Yuga year
	 * @param by Burmese year
	 * @returns Kali Yuga year
	 */
	public by2ky = (by: number): number => {
		if (!this.validYear(by)) {
			throw new Error("Invalid Burmese Year");
		}
		return by + 3739;
	};
	/**
	 * Burmese Year to Sasana Year ( Buddhist Era - BE)
	 * @param by Burmese Year
	 * @returns Sasana Year
	 */
	public by2ssy = (by: number): number => {
		if (!this.validYear(by)) {
			throw new Error("Invalid Burmese Year");
		}
		return by + 1182;
	};
	/**
	 * Burmese calendar era id
	 *
	 * Era Ids
	 *  - id = 3 : The third era (the era after Independence 1312 ME and after)
	 *  - id = 2 : The second era (the era under British colony: 1217 ME - 1311 ME)
	 *  - The first era (the era of Myanmar kings: ME1216 and before)
	 *    - id = 1.3 : Thandeikta (ME 1100 - 1216)
	 *    - id = 1.2 : Makaranta system 2 (ME 798 - 1099)
	 *    - id = 1.1 : Makaranta system 1 (ME 0 - 797)
	 * @param by Burmese Year
	 */
	protected eraId = (by: number) => {
		if (!this.validYear(by)) {
			throw new Error("Invalid Burmese Year");
		}
		let id: EraIds = 1.1;
		if (by >= 1312) {
			id = 3;
		} else if (by < 1312 && by >= 1217) {
			id = 2;
		} else if (by < 1217 && by >= 1100) {
			id = 1.3;
		} else if (by < 1100 && by >= 798) {
			id = 1.2;
		} else {
			id = 1.1;
		}
		return id;
	};
	/**
	 * Get some Burmese year constants depending on era
	 *
	 * @param by Burmese year
	 * @returns { WO: number; NM: number } - warhtat offset to compensate and number of months to find excess days
	 */
	protected getWoNm = (by: number): GetWoNm => {
		const eraConfigurations: Record<EraIds, GetWoNm> = {
			3: { WO: -0.5, NM: 8 },
			2: { WO: -1, NM: 4 },
			1.3: { WO: -0.85, NM: -1 },
			1.2: { WO: -1.1, NM: -1 },
			1.1: { WO: -1.1, NM: -1 },
		};
		// error handle already here
		const id: EraIds = this.eraId(by);
		return {
			WO: eraConfigurations[id].WO + this.searchFme(by),
			NM: eraConfigurations[id].NM,
		};
	};
	/**
	 * ရက်ပိုညှိကိန်း TA ဝါထပ်ကိန်း TW
	 *
	 * TA =  The number of excess days for past 4 lunar month before the beginning of a Burmese year
	 *
	 * TW =  The threshold to determine whether the excess days exceeds {@link LM} within the next 8 months of a Burmese year.
	 *
	 * @param by Burmese Year
	 *
	 */
	protected getTaTw = (by: number) => {
		// ရက်ပိုညှိကိန်း TA ဝါထပ်ကိန်း TW
		const { NM } = this.getWoNm(by);
		return {
			TA: (12 - NM) * (this.SY / 12 - this.LM),
			TW: this.LM - NM * (this.SY / 12 - this.LM),
		};
	};
	/**
	 * The number of excess days of a Burmese year
	 *
	 * @param by Burmese Year
	 */
	protected excessDays = (by: number): number => {
		// ed =( SY ( my + 3739 ) ) mod LM
		const edays: number = (this.SY * this.by2ky(by)) % this.LM;
		/*
      if ed < TA then
      ed = ed + LM
      end if
       */
		return edays < this.getTaTw(by).TA ? edays + this.LM : edays;
	};
	/**
	 * The Julian Day Number of the beginning of a Burmese year.
	 * @param by Burmese year
	 * @returns The Julian Day Number of the beginning of the given Burmese year.
	 */
	public newYearTime = (by: number): number => {
		return this.SY * by + this.MO;
	};
	/**
	 * Checking a year for intercalary month or not
	 * @param by Burmese Year
	 * @returns 1=warhtat, 0=common
	 */
	public checkWarhtat = (by: number) => {
		const ed = this.excessDays(by);
		const { TW } = this.getTaTw(by);
		const myt = ed >= TW ? 1 : 0;
		let result = 0;
		if (WTE.zero.includes(by)) {
			result = 0;
		} else if (WTE.one.includes(by)) {
			result = 1;
		} else {
			result = myt;
		}
		return result;
	};
	/**
	 * Full moon day of 2nd Warso
	 * @param by Burmese Year
	 * @returns Full moon day of 2nd Warso
	 */
	public searchWasoFullMoon = (by: number) => {
		return Math.round(
			this.newYearTime(by) -
				this.excessDays(by) +
				4.5 * this.LM +
				this.getWoNm(by).WO,
		);
	};
	/**
	 * Get leap year or year data base on given Burmese year
	 * @param by Burmese Year
	 * @returns [myt = type of Burmese Year][tg1 = first day of Tagu][fm = Full moon day of 2ndWaso][err = Error message]
	 */
	public getLeapYearData = (by: number): GetLeapYearData => {
		const a = this.checkWarhtat(by);
		const b1 = this.searchWasoFullMoon(by);
		let c = 0;
		let L = 0;
		let bs = 0;
		for (let i = 1; i < 4; i++) {
			bs = this.searchWasoFullMoon(by - i);
			c = this.checkWarhtat(by - i);
			L = i;
			if (c === 1) {
				break;
			}
		}
		const b3 = (b1 - bs) % 354;
		const myt = a === 0 ? a : Math.floor(b3 / 31) + a;
		const fm = a === 1 ? b1 : bs + 354 * L;
		const err = a === 1 && b3 !== 31 && b3 !== 30 ? 1 : 0;
		const tg1 = bs + 354 * L - 102;
		return { myt, tg1, fm, err };
	};
	/**
	 * Calculate the length of a month in the Burmese calendar.
	 *
	 * @param yt The type of the Burmese year.
	 * @param bm The month in the Burmese calendar [0-14].
	 * @returns The length of the month (30 for even months, 29 for odd months, with adjustments for "Nayon"=30 for "Big Warhtat").
	 */
	protected monthLength = (yt: number, bm: number) => {
		/* စုံ = ၃၀ မ = ၂၉ */
		let ml = 30 - (bm % 2);
		/*
      ဝါကြီးထပ်နှစ်အတွက် နယုန်လတွင်တစ်ရက်ပေါင်း
      29 + 1 = 30 days
      */
		if (bm === 3) {
			ml += Math.floor(yt / 2);
		}
		return ml;
	};
	public j2b = (jdn: number): JTB => {
		const j: number = Math.round(jdn);
		// return
		const by: number = Math.floor((j - 0.5 - this.MO) / this.SY);
		const yc: GetLeapYearData = this.getLeapYearData(by);
		// ရက်အရေအတွက်
		let dd: number = j - yc.tg1 + 1;
		const b: number = Math.floor(yc.myt / 2);
		const c: number = Math.floor(1 / (yc.myt + 1));

		const myl: number = 354 + (1 - c) * 30 + b;
		// month type: late =1 or early = 0
		const bmt = Math.floor((dd - 1) / myl);
		dd -= bmt * myl;
		// adjust day count and threshold
		const a: number = Math.floor((dd + 423) / 512);
		let bm: number = Math.floor((dd - b * a + c * a * 30 + 29.26) / 29.544);
		const e: number = Math.floor((bm + 12) / 16);
		const f: number = Math.floor((bm + 11) / 16);
		// return
		const bd: number =
			dd - Math.floor(29.544 * bm - 29.26) - b * e + c * f * 30;
		// adjust month numbers for late months
		// return
		bm += f * 3 - e * 4 + 12 * bmt;
		//return
		const yt: number = yc.myt;
		// ------------------------------------
		// length of Burmese month
		const bml = this.monthLength(yt, bm);
		// Moon Phase
		const mp =
			Math.floor((bd + 1) / 16) + Math.floor(bd / 16) + Math.floor(bd / bml);
		// fortnight day [1-15]
		const fd = bd - 15 * Math.floor(bd / 16);
		// Sasana Year ( Buddhist Era - BE)
		const ssy = by + 1182;
		// --- string
		const bm_str = this.BurmeseMonthName[bm];
		const mp_str = this.MoonPhase[mp];
		const wsofm = yc.fm;
		const tdkfm = wsofm + 89;
		const warDwin = jdn >= wsofm && jdn <= tdkfm;
		return {
			yt,
			ssy,
			by,
			bm,
			bd,
			fd,
			mp,
			bml,
			bmt,
			bm_str,
			mp_str,
			warDwin,
		};
	};
}
