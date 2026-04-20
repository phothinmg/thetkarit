// cSpell:disable
#ifndef BCAL_HPP_
#define BCAL_HPP_

#include "cal/mcal.hpp"
#include "cal/gcal.hpp"
#include "plib/pcolor.hpp"

#include <string>
#include <optional>
#include <cmath>
#include <set>
using namespace std;

#if defined(_WIN64) || defined(__WIN32__) || defined(_WIN32) || defined(WIN32) || defined(__WINDOWS__) || defined(__TOS_WIN__)
#define TKWINDOW
#include <windows.h>
#elif defined(unix) || defined(__unix) || defined(__unix__)
#define TKUNIX
#include <sys/time.h>
#endif

namespace bcal
{

    using mcal::Astros;
    using mcal::J2B;
    using mcal::Languages;
    using mcal::TgTime;
    using gcal::ct;
    using gcal::Dt2Jd;
    using gcal::Jd2Dt;
    using gcal::Ymd;
    
    using mcal::Burmese;
    using mcal::English;
    using gcal::gregorian;
    using gcal::julian;

    using mcal::getAstro;
    using mcal::holidays;
    using mcal::j2b;
    using mcal::tran_num;
    using mcal::tran_str;
    using mcal::tran_str_array;
    using mcal::tg_time;
    using gcal::cal_convert;
    using gcal::dt2jd;
    using gcal::jd2dt;
    using bcolor::print;
    using bcolor::println;
    using bcolor::print_color;
    using bcolor::print_color_reset;

   
  
    using gcal::g_months_long;
    using gcal::g_months_short;
    using gcal::week_days_long;
    using gcal::week_days_short;
   
   

    struct GetLocal
    {
        float local_offset;
        int _year;
    };
    struct BcalInfo
    {
        /// @brief Sasana Year BE
        int sasana_year;
        /// @brief Sasana Year BE string
        string sasana_year_str;
        /// @brief Burmese Year ME
        int burmese_year;
        /// @brief Burmese Year ME string
        string burmese_year_str;
        int burmese_month_index;
        string burmese_month_str;
        int moon_phases_index;
        string moon_phases_str;
        int fortnight_day;
        string fortnight_day_str;
        int burmese_day;
        string burmese_day_str;
        string mahabote;
        string nagahle;
        string nakhat;
        bool is_sabbath_schoolHoliday;
        string sabbath;
        string yatyaza;
        string pyathada;
        vector<string> public_holiday{};
    };

    struct Dv
    {
        int jdn;
        int year;
        string year_str;
        int month;
        string month_str_long;
        string month_str_short;
        int day;
        string day_str;
        string wd_str_long;
        string wd_str_short;
        BcalInfo bcal_info;
    };

    struct Mv
    {
        int year;
        string year_str;
        int month;
        string month_str_long;
        string month_str_short;
        int days_in_month;
        vector<int> sasana_years;
        vector<string> sasana_years_str;
        vector<int> burmese_years;
        vector<string> burmese_years_str;
        vector<int> burmese_months;
        vector<string> burmese_months_str;
        vector<Dv> date_views;
    };

    struct Yv
    {
        int year;
        string year_str;
        int days_in_year;
        vector<int> sasana_years;
        vector<string> sasana_years_str;
        vector<int> burmese_years;
        vector<string> burmese_years_str;
        vector<Mv> month_views;
    };
    template <typename T>
    vector<T> uniqueVector(const vector<T> &vec)
    {
        set<T> s(vec.begin(), vec.end());
        return vector<T>(s.begin(), s.end());
    }
    bool is_leap(int y)
    {
        return (fmod(y, 4) == 0 && fmod(y, 100) != 0) || fmod(y, 400) == 0;
    }
    vector<int> daysInMonth(const int &y)
    {
        std::vector<int> cy = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        std::vector<int> ly = {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        std::vector<int> y1582 = {31, 28, 31, 30, 31, 30, 31, 31, 30, 20, 30, 31};
        if (y == 1582)
        {
            return y1582;
        }
        else
        {
            return is_leap(y) ? ly : cy;
        }
    }
    GetLocal get_local()
    {
        float local_offset;
        int _year;
#ifdef TKWINDOW
        TIME_ZONE_INFORMATION tzi;
        GetTimeZoneInformation(&tzi);
        SYSTEMTIME lt;
        GetLocalTime(&lt);
        local_offset = static_cast<float>(-tzi.Bias / 60.0); // convert minutes to hours
        _year = lt.wYear;
#elif defined(TKUNIX)
        time_t mytime = time(0);
        struct tm tm_ptr;
        localtime_r(&mytime, &tm_ptr);
        local_offset = static_cast<float>((double)tm_ptr.tm_gmtoff / 60 / 60);
        _year = tm_ptr.tm_year + 1900;
#endif

        return {local_offset, _year};
    }

    int wdid(double jd)
    {
        int _jd = round(jd);
        int j = _jd + 2;
        return static_cast<int>(fmod(j, 7));
    }

    int wd_id(double jd)
    {
        int _jd = round(jd);
        int j = _jd + 1;
        return static_cast<int>(fmod(j, 7));
    }
    BcalInfo bcalInfo(int year, int month, int day, optional<Languages> lang = nullopt)
    {
        Languages lan = lang.value_or(English);
        Dt2Jd j = dt2jd(year, month, day);
        J2B bdt = j2b(j.jd);
        int weekday_id = wdid(j.jd);
        Astros ast = getAstro(bdt.by, bdt.bm, bdt.bml, bdt.bd, weekday_id);

        bool is_sbhld = ast.sabbath_index == 1 && bdt.warDwin;

        int sasana_year = bdt.ssy;
        string sasana_year_str = tran_num(bdt.ssy, lan);
        int burmese_year = bdt.by;
        string burmese_year_str = tran_num(bdt.by, lan);
        int burmese_month_index = bdt.bm;
        string burmese_month_str = tran_str(bdt.bm_str, lan);
        int moon_phases_index = bdt.mp;
        string moon_phases_str = tran_str(bdt.mp_str, lan);
        int fortnight_day = bdt.fd;
        string fortnight_day_str = tran_num(bdt.fd, lan);
        int burmese_day = bdt.bd;
        string burmese_day_str = tran_num(bdt.bd, lan);
        string mahabote = tran_str(ast.mahabote, lan);
        string nagahle = tran_str(ast.nagahle, lan);
        string nakhat = tran_str(ast.natkhat, lan);
        bool is_sabbath_schoolHoliday = is_sbhld;
        string sabbath = tran_str(ast.sabbath, lan);
        string yatyaza = tran_str(ast.yatyaza, lan);
        string pyathada = tran_str(ast.pyathada, lan);
        vector<string> public_holiday = tran_str_array(holidays(j.jdn, year, month, day, bdt.by, bdt.bm, bdt.bd, bdt.mp, bdt.bmt), lan);

        return {
            sasana_year, sasana_year_str, burmese_year, burmese_year_str, burmese_month_index, burmese_month_str, moon_phases_index, moon_phases_str,
            fortnight_day, fortnight_day_str, burmese_day, burmese_day_str, mahabote, nagahle, nakhat, is_sabbath_schoolHoliday, sabbath, yatyaza,
            pyathada, public_holiday};
    }
    Yv year_v(optional<int> y = nullopt, optional<Languages> lang = nullopt)
    {
        GetLocal loc = get_local();
        Languages lan = lang.value_or(English);
        int year = y.value_or(loc._year);
        string year_str = tran_num(year, lan);
        int days_in_year = year == 1582 ? 354 : is_leap(year) ? 366
                                                              : 365;
        vector<int> dims = daysInMonth(year);

        vector<Mv> month_views;

        /* temps */
        vector<int> _temp_ssys;
        vector<string> _temp_ssys_str;
        vector<int> _temp_bys;
        vector<string> _temp_bys_str;

        for (int i = 0; i < 12; i++)
        {
            int days_in_month = dims[i];
            int month = i + 1;
            string month_str_long = tran_str(g_months_long[i], lan);
            string month_str_short = g_months_short[i];
            vector<int> _temp_bms;
            vector<string> _temp_bms_str;
            vector<Dv> date_views;
            for (int j = 0; j < days_in_month; j++)
            {
                int day = j + 1;
                string day_str = tran_num(day, lan);
                Dt2Jd _jd = dt2jd(year, month, day, 12, 0, 0, loc.local_offset);
                int jdn = _jd.jdn;
                int _wdid = wd_id(_jd.jd);
                string wd_str_long = tran_str(week_days_long[_wdid], lan);
                string wd_str_short = week_days_short[_wdid];
                BcalInfo bcal_info = bcalInfo(year, month, day, lan);

                Dv dv = {jdn, year, year_str, month, month_str_long, month_str_short, day, day_str, wd_str_long, wd_str_short, bcal_info};

                _temp_ssys.push_back(bcal_info.sasana_year);
                _temp_ssys_str.push_back(bcal_info.sasana_year_str);
                _temp_bys.push_back(bcal_info.burmese_year);
                _temp_bys_str.push_back(bcal_info.burmese_year_str);
                _temp_bms.push_back(bcal_info.burmese_month_index);
                _temp_bms_str.push_back(bcal_info.burmese_month_str);
                date_views.push_back(dv);
            }
            vector<int> sasana_years = uniqueVector(_temp_ssys);
            vector<string> sasana_years_str = uniqueVector(_temp_ssys_str);
            vector<int> burmese_years = uniqueVector(_temp_bys);
            vector<string> burmese_years_str = uniqueVector(_temp_bys_str);
            vector<int> burmese_months = uniqueVector(_temp_bms);
            vector<string> burmese_months_str = uniqueVector(_temp_bms_str);
            Mv mv = {
                year, year_str, month, month_str_long, month_str_short, days_in_month, sasana_years,
                sasana_years_str, burmese_years, burmese_years_str, burmese_months, burmese_months_str, date_views};
            month_views.push_back(mv);
        }
        vector<int> sasana_years = uniqueVector(_temp_ssys);
        vector<string> sasana_years_str = uniqueVector(_temp_ssys_str);
        vector<int> burmese_years = uniqueVector(_temp_bys);
        vector<string> burmese_years_str = uniqueVector(_temp_bys_str);
        Yv yv = {year, year_str, days_in_year, sasana_years, sasana_years_str, burmese_years, burmese_years_str, month_views};

        return yv;
    }
    Mv month_v(int year, int month)
    {
        Yv yv = year_v(year);
        Mv mv = yv.month_views[month - 1];
        return mv;
    }

    Dv day_v(int year, int month, int day)
    {
        Yv yv = year_v(year);
        Mv mv = yv.month_views[month - 1];
        Dv dv = mv.date_views[day - 1];

        return dv;
    }

} // namespace bcal

#endif // BCAL_HPP_