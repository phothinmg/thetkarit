import { BcAstro } from "./bcal/astro-days";
import { BcHolidays } from "./bcal/holidays";
import { BcCal, type JTB } from "./bcal/index.js";
import { BcTranslate } from "./bcal/translate";
import type { Language } from "./bcal/translate/types";
import { helpers } from "./helpers";
import { BcGcal } from "./julian";
import type { MontnViewOptions, YearViewOptions } from "./types";
import type { DateViewOptions } from "./types";
import type { DateViewObject, MonthViewObject } from "./types";
import type { YearViewObject } from "./types";

// New instances for BcCal , BcTranslate and BcGcal
const B = new BcCal();
const T = new BcTranslate();
const G = new BcGcal();
//
/*!
The Algorithm for calculation of Burmese Calendar (Myanmar Calendar) by Dr. Yan Naing Aye.
Reference: https://cool-emerald.blogspot.com/2013/06/algorithm-program-and-calculation-of.html
 */
export class BurmeseCal {
  private _lang: Language = "English";
  private _year: number = new Date().getFullYear();
  private cal() {
    // days of each month in this._langyear
    const month_array: number[] = helpers.daysInMonth(this._year);
    const diy = helpers.isLeapYear(this._year) ? 366 : 365;
    // Sasana year and temp storage for that
    let _ssy: string | number = "";
    const ssy_str: string[] = [];
    const ssy_num: number[] = [];
    const ssy_ids: number[] = [];
    // Burmese year and temp storage for that
    let _by: string | number = "";
    const by_str: string[] = [];
    const by_num: number[] = [];
    const by_ids: number[] = [];
    // year object
    const year_object: YearViewObject = {
      year: {
        id: this._year,
        str: T.translateNum(this._year, this._lang),
        days_in_year: diy,
      },
      sasana_years: {
        ids: [],
        str: [],
      },
      burmese_years: {
        ids: [],
        str: [],
      },
      month_views: [],
    };
    // ==========================
    //     Start of Months loop
    // ==========================
    for (let i = 0; i < 12; i++) {
      const days_InMonth: number = month_array[i];
      const bm_str: string[] = [];
      const bm_index: number[] = [];
      const month_object: MonthViewObject = {
        year: {
          id: this._year,
          str: T.translateNum(this._year, this._lang),
        },
        month: {
          id: i + 1,
          long: T.translateStr(G.MONTHS[i], this._lang) as string,
          short: G.MONTH_SHORT[i],
          days_in_month: days_InMonth,
        },
        sasana_years: {
          ids: [],
          str: [],
        },
        burmese_years: {
          ids: [],
          str: [],
        },
        burmese_months: {
          index: [],
          str: [],
        },
        date_views: [],
      };
      // ==========================
      //     Start of Days loop
      // ==========================
      for (let j = 1; j <= days_InMonth; j++) {
        const _month = i + 1;
        // get jd
        const { jd, jdn } = G.gregorianToJd({
          year: this._year,
          month: _month,
          day: j,
        });
        const wd = helpers.weekdayId(jdn);
        const _wd = helpers.weekday_id(wd);
        // Burmese Calendar Info
        const bcal: JTB = B.j2b(jdn);
        const astro = new BcAstro({
          by: bcal.by,
          bm: bcal.bm,
          bd: bcal.bd,
          wd: _wd,
          lm: bcal.bml,
        });
        const hlds = new BcHolidays({
          jdn: jdn,
          year: this._year,
          month: _month,
          day: j,
          mp: bcal.mp,
          bmt: bcal.bmt,
          by: bcal.by,
          bm: bcal.bm,
          bd: bcal.bd,
        });
        bm_str.push(T.translateStr(bcal.bm_str, this._lang) as string);
        bm_index.push(bcal.bm);
        ssy_ids.push(bcal.ssy);
        by_ids.push(bcal.by);
        // _ssy
        _ssy = T.translateNum(bcal.ssy, this._lang);
        if (typeof _ssy === "string") {
          ssy_str.push(_ssy);
        } else if (typeof _ssy === "number") {
          ssy_num.push(_ssy);
        }
        // _by
        _by = T.translateNum(bcal.by, this._lang);
        if (typeof _by === "string") {
          by_str.push(_by);
        } else if (typeof _by === "number") {
          by_num.push(_by);
        }
        const date_object: DateViewObject = {
          jdn: jdn,
          year: {
            id: this._year,
            str: T.translateNum(this._year, this._lang),
          },
          month: {
            id: i + 1,
            long: T.translateStr(G.MONTHS[i], this._lang) as string,
            short: G.MONTH_SHORT[i],
            days_in_month: days_InMonth,
          },
          day: {
            id: j,
            str: T.translateNum(j, this._lang),
          },
          weekday: {
            index: wd,
            long: T.translateStr(G.WEEK_DAYS[wd], this._lang) as string,
            short: G.WEEK_DAYS_SHORT[wd],
          },
          isHoliday: hlds.holidaysArray.length > 0,
          burmese_cal: {
            sasana_year: {
              id: bcal.ssy,
              str: T.translateNum(bcal.ssy, this._lang),
            },
            burmese_year: {
              id: bcal.by,
              str: T.translateNum(bcal.by, this._lang),
            },
            burmese_month: {
              index: bcal.bm,
              str: T.translateStr(bcal.bm_str, this._lang) as string,
            },
            moon_phase: {
              index: bcal.mp,
              str: T.translateStr(bcal.mp_str, this._lang) as string,
            },
            fortnight_day: {
              id: bcal.fd,
              str: T.translateNum(bcal.fd, this._lang),
            },
            burmese_day: {
              id: bcal.bd,
              str: T.translateNum(bcal.bd, this._lang),
            },
            sabbath: {
              index: astro.sabbath.index,
              str: T.translateStr(astro.sabbath.str, this._lang) as string,
              school_holiday: bcal.warDwin && astro.sabbath.index === 1,
            },
            yatyaza: {
              index: astro.yatyaza.index,
              str: T.translateStr(astro.yatyaza.str, this._lang) as string,
            },
            pyathada: {
              index: astro.pyathada.index,
              str: T.translateStr(astro.pyathada.str, this._lang) as string,
            },
            nagahle: {
              index: astro.nagahle.index,
              str: T.translateStr(astro.nagahle.str, this._lang) as string,
            },
            nakhat: {
              index: astro.natkhat.index,
              str: T.translateStr(astro.natkhat.str, this._lang) as string,
            },
            mahabote: {
              index: astro.mahabote.index,
              str: T.translateStr(astro.mahabote.str, this._lang) as string,
            },
            astro_days: T.translateStr(astro.astroDays, this._lang) as string[],
            public_holiday: T.translateStr(
              hlds.holidaysArray,
              this._lang
            ) as string[],
          },
        };
        // push day object to month object end of days loop
        month_object.date_views.push(date_object);
        // == End of Days loop
      }
      // remove all duplicate values from string or number arrays of month object push by days loop
      month_object.burmese_months.index = helpers.uniqNumber(bm_index);
      month_object.burmese_months.str = helpers.uniqString(bm_str);
      // push ssy from temp storage
      month_object.sasana_years.ids = helpers.uniqNumber(ssy_ids);
      month_object.sasana_years.str =
        typeof _ssy === "string"
          ? helpers.uniqString(ssy_str)
          : helpers.uniqNumber(ssy_num);
      // push burmese year from temp storage
      month_object.burmese_years.ids = helpers.uniqNumber(by_ids);
      month_object.burmese_years.str =
        typeof _by === "string"
          ? helpers.uniqString(by_str)
          : helpers.uniqNumber(by_num);
      // push month object to year object
      year_object.month_views.push(month_object);
      // End of Months loop
    }
    // remove all duplicate values from string or number arrays of year object push by  days and months loops
    year_object.sasana_years.ids = helpers.uniqNumber(ssy_ids);
    year_object.sasana_years.str =
      typeof _ssy === "string"
        ? helpers.uniqString(ssy_str)
        : helpers.uniqNumber(ssy_num);
    // --
    year_object.burmese_years.ids = helpers.uniqNumber(by_ids);
    year_object.burmese_years.str =
      typeof _by === "string"
        ? helpers.uniqString(by_str)
        : helpers.uniqNumber(by_num);
    return year_object;
  }
  /**
   * Update the calendar to a specific year and return the detailed year view.
   *
   * This method sets the internal state of the calendar to the specified year,
   * using the provided or default language and time zone. It then computes and
   * returns the detailed information for that year in the Burmese calendar.
   *
   * @param year - The year to be set in the calendar.
   * @param lang - Optional language setting for the calendar. Defaults to "English".
   * @param tz - Optional time zone setting for the calendar. Defaults to "Asia/Yangon".
   * @param ct - Optional calendar type setting for the calendar. Defaults to "Gregorian".
   * @returns The year object containing detailed information for the specified year.
   */
  public yearView({ year, lang = "English" }: YearViewOptions): YearViewObject {
    this._year = year;
    this._lang = lang;
    return this.cal();
  }
  /**
   * Update the calendar to a specific month and return the detailed month view.
   *
   * This method sets the internal state of the calendar to the specified year
   * and month, using the provided or default language and time zone. It then
   * computes and returns the detailed information for that month in the Burmese
   * calendar.
   *
   * @param year - The year to be set in the calendar.
   * @param month - The month to be set in the calendar [1=Jan,...,12=Dec].
   * @param lang - Optional language setting for the calendar. Defaults to "English".
   * @param tz - Optional time zone setting for the calendar. Defaults to "Asia/Yangon".
   * @param ct - Optional calendar type setting for the calendar. Defaults to "Gregorian".
   * @returns The month object containing detailed information for the specified month.
   */
  public monthView({
    year,
    month,
    lang = "English",
  }: MontnViewOptions): MonthViewObject {
    this._year = year;
    this._lang = lang;
    return this.cal().month_views[month - 1];
  }

  /**
   * Get the detailed information for a specific date in the Burmese calendar.
   *
   * This method sets the internal state of the calendar to the specified year,
   * month and day, using the provided or default language and time zone. It
   * then computes and returns the detailed information for that date in the
   * Burmese calendar.
   *
   * @param year - The year to be set in the calendar.
   * @param month - The month to be set in the calendar [1=Jan,...,12=Dec].
   * @param day - The day to be set in the calendar [1-31].
   * @param lang - Optional language setting for the calendar. Defaults to "English".
   * @param tz - Optional time zone setting for the calendar. Defaults to "Asia/Yangon".
   * @param ct - Optional calendar type setting for the calendar. Defaults to "Gregorian".
   * @returns The date object containing detailed information for the specified date.
   */
  public dateView({
    year,
    month,
    day,
    lang = "English",
  }: DateViewOptions): DateViewObject {
    this._year = year;
    this._lang = lang;
    return this.cal().month_views[month - 1].date_views[day - 1];
  }
}
