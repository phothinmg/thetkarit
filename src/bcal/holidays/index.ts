import { deepavali } from "./deepavali";
import { eidDays } from "./eidDays";
import { substituteHolidays } from "./substituteHolidays";
interface HolidaysOpts {
	/**
	 * Julian Day Number
	 */
	jdn: number;
	/**
	 * Gregorian Calendar Year
	 */
	year: number;
	/**
	 * Gregorian Calendar Month
	 */
	month: number;
	/**
	 * Gregorian Calendar Day
	 */
	day: number;
	/**
	 * Moon Phase
	 */
	mp: number;
	/**
	 * Burmese Year
	 */
	by: number;
	/**
	 * Burmese Month
	 */
	bm: number;
	/**
	 * Burmese day
	 */
	bd: number;
	/**
	 * Burmese Month Type
	 */
	bmt: number;
}

//-- Holidays
export class BcHolidays {
	public holidaysArray: string[];
	private _year: number;
	private _jdn: number;
	private _month: number;
	private _mp: number;
	private _day: number;
	private _by: number;
	private _bm: number;
	private _bd: number;
	private _bmt: number;
	constructor({ jdn, year, month, day, mp, by, bm, bd, bmt }: HolidaysOpts) {
		this._jdn = jdn;
		this._year = year;
		this._month = month;
		this._day = day;
		this._mp = mp;
		this._by = by;
		this._bm = bm;
		this._bd = bd;
		this._bmt = bmt;
		this.holidaysArray = this.init();
	}
	/**
	 *  **Get public holidays of Burma on Burmese Calendar's date**
	 * @param by Burmese Calendar Year
	 * @param bm Burmese Calendar Month
	 * @param bd Burmese Calendar Day
	 * @param mp Moon Phase
	 * @param hs String array to collect holidays
	 */
	private bmHolidays(
		by: number,
		bm: number,
		bd: number,
		mp: number,
		hs: string[],
	): void {
		if (bm === 2 && mp === 1) {
			hs.push("Buddha Day");
		} //Vesak day
		else if (bm === 4 && mp === 1) {
			hs.push("Beginning of Buddhist Lent");
		} //Warso day
		else if (bm === 7 && mp === 1) {
			hs.push("End of Buddhist Lent");
		} else if (by >= 1379 && bm === 7 && (bd === 14 || bd === 16)) {
			hs.push("Holiday");
		} else if (bm === 8 && mp === 1) {
			hs.push("Tazaungdaing");
		} else if (by >= 1379 && bm === 8 && bd === 14) {
			hs.push("Holiday");
		} else if (by >= 1282 && bm === 8 && bd === 25) {
			hs.push("National Day");
		} else if (bm === 10 && bd === 1) {
			hs.push("Karen New Year's Day");
		} else if (bm === 12 && mp === 1) {
			hs.push("Tabaung Pwe");
		}
	}
	/**
	 * **Get public holidays of Myanmar on Gregorian date**
	 * @param year
	 * @param month
	 * @param day
	 * @param hs String array to collect holidays
	 */
	private gregorianHolidays(
		year: number,
		month: number,
		day: number,
		hs: string[],
	): void {
		if (year >= 2018 && year <= 2021 && month === 1 && day === 1) {
			hs.push("New Year's Day");
		} else if (year >= 1948 && month === 1 && day === 4) {
			hs.push("Independence Day");
		} else if (year >= 1947 && month === 2 && day === 12) {
			hs.push("Union Day");
		} else if (year >= 1958 && month === 3 && day === 2) {
			hs.push("Peasants' Day");
		} else if (year >= 1945 && month === 3 && day === 27) {
			hs.push("Armed Forces Day");
		} else if (year >= 1923 && month === 5 && day === 1) {
			hs.push("Labour Day");
		} else if (year >= 1947 && month === 7 && day === 19) {
			hs.push("Martyrs' Day");
		} else if (year >= 1752 && month === 12 && day === 25) {
			hs.push("Christmas");
		} else if (year === 2017 && month === 12 && day === 30) {
			hs.push("Holiday");
		} else if (year >= 2017 && year <= 2021 && month === 12 && day === 31) {
			hs.push("Holiday");
		}
	}
	/**
	 * **Get Thingyan Holidays**
	 * @param jdn Julian Day Number
	 * @param by Burmese Calendar Year
	 * @param bmt Burmese Month Type
	 * @param hs String array to collect holidays
	 */
	private thingyanHolidays(jdn: number, by: number, bmt: number, hs: string[]) {
		//solar year (365.2587565)
		const SY: number = 1577917828.0 / 4320000.0;
		//beginning of 0 ME
		const MO: number = 1954168.050623;
		//start of Thingyan
		const BGNTG: number = 1100;
		//third era
		const SE3: number = 1312;
		const atat = SY * (by + bmt) + MO;
		let atar = 0;
		if (by >= SE3) {
			atar = atat - 2.169918982;
		} else {
			atar = atat - 2.1675;
		}
		const akyaNay = Math.floor(atar);
		const atatNay = Math.floor(atat);
		if (jdn === atatNay + 1) {
			hs.push("Burmese New Year's Day");
		}
		if (by + bmt >= BGNTG) {
			if (jdn === atatNay) {
				hs.push("Thingyan Atat");
			} else if (jdn > akyaNay && jdn < atatNay) {
				hs.push("Thingyan Akyat");
			} else if (jdn === akyaNay) {
				hs.push("Thingyan Akya");
			} else if (jdn === akyaNay - 1) {
				hs.push("Thingyan Akyo");
				//conditional add thingyan holidays
			} else if (
				by + bmt >= 1369 &&
				by + bmt < 1379 &&
				(jdn === akyaNay - 2 || (jdn >= atatNay + 2 && jdn <= akyaNay + 7))
			) {
				hs.push("Holiday");
			} else if (
				by + bmt >= 1384 &&
				by + bmt <= 1385 &&
				(jdn === akyaNay - 5 ||
					jdn === akyaNay - 4 ||
					jdn === akyaNay - 3 ||
					jdn === akyaNay - 2)
			) {
				hs.push("Holiday");
			} else if (by + bmt >= 1386 && jdn >= atatNay + 2 && jdn <= akyaNay + 7) {
				hs.push("Holiday");
			}
		}
	}
	private eid_day(jdn: number, hs: string[]) {
		if (eidDays.includes(jdn)) {
			hs.push("Eid al-Adha");
		}
	}
	private substitute(jdn: number, hs: string[]) {
		if (substituteHolidays.includes(jdn)) {
			hs.push("Holiday");
		}
	}
	private de_pavali(jdn: number, hs: string[]) {
		if (deepavali.includes(jdn)) {
			hs.push("Deepavali");
		}
	}
	private init() {
		const hhs: string[] = [];
		this.bmHolidays(this._by, this._bm, this._bd, this._mp, hhs);
		this.gregorianHolidays(this._year, this._month, this._day, hhs);
		this.thingyanHolidays(this._jdn, this._by, this._bmt, hhs);
		this.eid_day(this._jdn, hhs);
		this.de_pavali(this._jdn, hhs);
		this.substitute(this._jdn, hhs);
		return hhs;
	}
}
