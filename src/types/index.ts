import type { Language } from "../bcal/translate/types";
// ----------------------------------------------------
export type DateViewOptions = {
	/**
	 * Gregorian year
	 */
	year: number;
	/**
	 * Gregorian month
	 */
	month: number;
	/**
	 * Gregorian day
	 */
	day: number;
	/**
	 * Language for output
	 *
	 * @default English
	 */
	lang?: Language;
};
//-----
export type MontnViewOptions = {
	/**
	 * Gregorian year
	 */
	year: number;
	/**
	 * Gregorian month
	 */
	month: number;

	/**
	 * Language for output
	 *
	 * @default English
	 */
	lang?: Language;
};
// --------
export type YearViewOptions = {
	/**
	 * Gregorian year
	 */
	year: number;
	/**
	 * Language for output
	 *
	 * @default English
	 */
	lang?: Language;
};

export type DateViewObject = {
	/**
	 * Julian Day Number
	 */
	jdn: number;
	/**
	 * Gregorian Year
	 */
	year: {
		/**
		 * Gregorian Year in Number
		 */
		id: number;
		/**
		 * Gregorian Year in string
		 */
		str: string | number;
	};
	/**
	 * Gregorian Month
	 */
	month: {
		/**
		 * 1 - 12 [1=Jan,...,12=Dec]
		 */
		id: number;
		/**
		 * Name of Gregorian Month eg.January
		 */
		long: string;
		/**
		 * Name of Gregorian Month eg.Jan
		 */
		short: string;
		/**
		 * Number of days in this month
		 */
		days_in_month: number;
	};
	/**
	 * Gregorian Day
	 */
	day: {
		/**
		 * Gregorian Day in Number
		 */
		id: number;
		/**
		 * Gregorian Day in string
		 */
		str: string | number;
	};
	/**
	 * Weekday
	 */
	weekday: {
		/**
		 * Week day index,not related to calculation just for place first day of the month on month-view UI
		 *
		 * [0=sun , ... , 6=sat]
		 */
		index: number;
		/**
		 * weekday long
		 */
		long: string;
		/**
		 * weekday short
		 */
		short: string;
	};
	/**
	 * Public Holidays Or Not
	 */
	isHoliday: boolean;
	/**
	 * Burmese Calendar info
	 */
	burmese_cal: {
		/**
		 * Sasana Year BE
		 */
		sasana_year: {
			id: number;
			str: number | string;
		};
		/**
		 * Burmese Year
		 */
		burmese_year: {
			id: number;
			str: number | string;
		};
		/**
		 * Burmese Month
		 */
		burmese_month: {
			index: number;
			str: string;
		};
		/**
		 * Moon Phase
		 */
		moon_phase: {
			index: number;
			str: string;
		};
		/**
		 * Fortnight Day
		 */
		fortnight_day: {
			/**
			 *  [1 - 15] Or [1 - 14]
			 */
			id: number;
			str: string | number;
		};
		/**
		 * Burmese Day of a Burmese Month
		 */
		burmese_day: {
			/**
			 *  [1 - 30] Or [1 - 31]
			 */
			id: number;
			str: string | number;
		};
		/**
		 * Yatyaza
		 */
		yatyaza: {
			/**
			 * [0="",1="Yatyaza"]
			 */
			index: number;
			str: string;
		};
		/**
		 * Pyathada
		 */
		pyathada: {
			/**
			 * [0="",1="Pyathada",2="Afternoon Pyathada"]
			 */
			index: number;
			str: string;
		};
		/**
		 * Sabbath
		 */
		sabbath: {
			/**
			 * [0="",1="Sabbath",2="Sabbath Eve"]
			 */
			index: number;
			str: string;
			school_holiday: boolean;
		};
		/**
		 * Dragon Head Direction
		 */
		nagahle: {
			/**
			 * [0="West",1="North",2="East",3="South"]
			 */
			index: number;
			str: string;
		};
		/**
		 * Mahabote
		 */
		mahabote: {
			/**
			 * [0="Binga",1= "Ahtun",2="Yaza",3="Adipati",4="Marana",5="Thike",6="Puti"]
			 */
			index: number;
			str: string;
		};
		/**
		 * Nakhat
		 */
		nakhat: {
			/**
			 * [0="Ogre",1="Elf",2="Human"]
			 */
			index: number;
			str: string;
		};
		/**
		 * Array of Astrological days
		 */
		astro_days: string[];
		/**
		 * Array of Public Holidays
		 */
		public_holiday: string[];
	};
};
//--------------------------------------------------------------------------------------------------------------------
export type MonthViewObject = {
	/**
	 * Gregorian Year
	 */
	year: {
		/**
		 * Gregorian Year in Number
		 */
		id: number;
		/**
		 * Gregorian Year in string
		 */
		str: string | number;
	};
	/**
	 * Gregorian Month
	 */
	month: {
		/**
		 * 1 - 12 [1=Jan,...,12=Dec]
		 */
		id: number;
		/**
		 * Name of Gregorian Month eg.January
		 */
		long: string;
		/**
		 * Name of Gregorian Month eg.Jan
		 */
		short: string;
		/**
		 * Number of days in this month
		 */
		days_in_month: number;
	};
	/**
	 * Sasana Year[BE]
	 */
	sasana_years: {
		ids: number[];
		str: string[] | number[];
	};
	/**
	 * Burmese Year[ME]
	 */
	burmese_years: {
		ids: number[];
		str: string[] | number[];
	};
	/**
	 * Burmese Month
	 */
	burmese_months: {
		index: number[];
		str: string[];
	};
	/**
	 * DateViewObjects array
	 */
	date_views: Array<DateViewObject>;
};
// ------------------------------------------------------------------------------------------------------

export type YearViewObject = {
	/**
	 * Gregorian Year
	 */
	year: {
		/**
		 * Gregorian Year in Number
		 */
		id: number;
		/**
		 * Gregorian Year in string
		 */
		str: string | number;
		/**
		 * Number of days in this year
		 */
		days_in_year: number;
	};
	/**
	 * Sasana Year[BE]
	 */
	sasana_years: {
		ids: number[];
		str: string[] | number[];
	};
	/**
	 * Burmese Year[ME]
	 */
	burmese_years: {
		ids: number[];
		str: string[] | number[];
	};
	/**
	 * MonthViewObjects array
	 */
	month_views: Array<MonthViewObject>;
};
