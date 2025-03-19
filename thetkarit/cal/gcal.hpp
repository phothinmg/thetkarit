
/*
Calculae the relations of  Gregorian calendar and Julian[Julian Calendar Date,Julian Date,Julian Day Number]

@phothinmg , 2025

References:
    - A collection of astronomy related programs, algorithms, tutorials,
      and data by Greg Miller (gmiller@gregmiller.net).
      https://www.celestialprogramming.com/julian.html

    - Difference between Gregorian and Julian calendar dates
      https://en.wikipedia.org/wiki/Gregorian_calendar

*/

#ifndef GCAL_HPP_
#define GCAL_HPP_

#include <string>
#include <vector>
#include <cmath>
#include <optional>

using namespace std;

namespace gcal
{
    vector<string> week_days_long = {
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    };
    vector<string> week_days_short = {
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    };
    vector<string> g_months_long = {
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    };
    vector<string> g_months_short = {
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    };
    enum ct
    {
        gregorian,
        julian
    };
    enum gt
    {
        isg,
        isp,
        isnot
    };
    struct G2JD
    {
        int year;
        int month;
        int day;
        optional<int> hour = nullopt;
        optional<int> minute = nullopt;
        optional<int> seconds = nullopt;
        optional<float> tz_offset = nullopt;
    };
    struct Dt2Jd
    {
        double jd;
        int jdn;
    };
    struct Jd2Dt
    {
        int year;
        int month;
        int day;
        int hour;
        int minute;
        int seconds;
    };
    struct Ymd
    {
        int year;
        int month;
        int day;
    };
    /// @brief Special "Math.floor()" function by Greg Miller (gmiller@gregmiller.net).
    double INT(double d)
    {
        if (d > 0)
        {
            return floor(d);
        }
        if (d == floor(d))
        {
            return d;
        }
        return floor(d) - 1;
    }

    /// @brief Calculates the secular difference for the given year,determining the difference between the Julian and Gregorian calendar systems.
    /// @param y The year for which the secular difference is to be calculated.
    /// @return The number of days different between Gregorian and Julian calendar systems.
    /// If converting from Julian to Gregorian, add the result. If converting from Gregorian to Julian, subtract.
    int secular_diff(const int &y)
    {
        return static_cast<int>(floor(y / 100) - floor(y / 400) - 2);
    }
    gt check_g(const int &y, const int &m, const int &d)
    {
        bool is_not = y == 1582 && m == 10 && d > 4 && d < 15;
        bool is_p = y < 1582 || (y == 1582 && (m < 10 || (m == 10 && d <= 4)));
        return is_not ? isnot : is_p ? isp
                                     : isg;
    }
    Dt2Jd dt2jd(int year, int month, int day, optional<int> hour = nullopt, optional<int> minute = nullopt, optional<int> seconds = nullopt, optional<float> tz_offset = nullopt)
    {
        gcal::gt result = gcal::check_g(year, month, day);
        if (result == isnot)
        {
            day = 4;
        }

        int _hour = hour.value_or(12);
        int _minute = minute.value_or(0);
        int _seconds = seconds.value_or(0);
        float tz = tz_offset.value_or(0.0);

        float tzos = tz / 24;
        float def = (_hour - 12) / 24.0 + _minute / 1440.0 + _seconds / 86400.0;

        double a = floor((month - 3) / 12);
        double x4 = year + a;
        double x3 = floor(x4 / 100);
        double x2 = fmod(x4, 100);
        double x1 = month - 12 * a - 3;

        double _jdn =
            floor((146097 * x3) / 4) +
            floor((36525 * x2) / 100) +
            floor((153 * x1 + 2) / 5) +
            day +
            1721119;

        double jd = _jdn + tzos + def;
        if (result == isp)
        {
            jd += 10;
        }
        int jdn = static_cast<int>(round(jd));
        return {
            jd,
            jdn,
        };
    }
    Jd2Dt jddt(double jd, optional<float> tz_offset = nullopt)
    {
        float tz = tz_offset.value_or(0.0);
        double temp = jd + 0.5 + (tz / 24);
        int Z = trunc(temp);
        double F = temp - Z;
        int A = Z;
        if (Z >= 2299161)
        {
            double alpha = INT((Z - 1867216.25) / 36524.25);
            A = Z + 1 + alpha - INT(alpha / 4);
        }

        int B = A + 1524;
        double C = INT((B - 122.1) / 365.25);
        double D = INT(365.25 * C);
        double E = INT((B - D) / 30.6001);

        int day = static_cast<int>(B - D - INT(30.6001 * E) + F);
        int month = static_cast<int>(E - 1);
        if (E > 13)
        {
            month = E - 13;
        }
        int year = C - 4716;
        if (month < 3)
        {
            year = C - 4715;
        }
        double P = F * 24;
        int hour = static_cast<int>(trunc(P));
        double H = (P - hour) * 60;
        int minute = static_cast<int>(trunc(H));
        double O = (H - minute) * 60;
        int seconds = static_cast<int>(round(O));

        return {year, month, day, hour, minute, seconds};
    }
    Jd2Dt jd2dt(double jd, optional<float> tz_offset = nullopt)
    {
        float tz = tz_offset.value_or(0.0);
        double jdd = jd + tz / 24;

        double jdn = round(jdd);

        double a = 4 * jdn - 6884477;
        double x3 = floor(a / 146097);
        double r3 = fmod(a, 146097);

        double b = 100 * floor(r3 / 4) + 99;
        double x2 = floor(b / 36525);
        double r2 = fmod(b, 36525);

        double c = 5 * floor(r2 / 100) + 2;
        double x1 = floor(c / 153);
        double r1 = fmod(c, 153);

        double cc = floor((x1 + 2) / 12);
        int year = static_cast<int>(100 * x3 + x2 + cc);
        int month = static_cast<int>(x1 - 12 * cc + 3);
        int day = static_cast<int>(floor(r1 / 5) + 1);

        double j = floor(jdd);
        double fjdn = jdd - j;
        double xx1 =
            fjdn >= 0.5
                ? (fjdn * 86400 - 43200) / 3600
                : (fjdn * 86400 + 43200) / 3600;
        int hour = static_cast<int>(floor(xx1));
        double xx2 = (xx1 - hour) * 3600;
        double xx3 = xx2 / 60;
        int minutes = static_cast<int>(floor(xx3));
        int seconds = floor((xx3 - minutes) * 60);

        return {year, month, day, hour, minutes, seconds};
    }
    Ymd cal_convert(ct ct_to, int y, int m, int d)
    {
        Dt2Jd j = dt2jd(y, m, d);
        int diff = secular_diff(y);
        double jdd = ct_to == julian ? j.jd - diff : j.jd + diff;
        Jd2Dt dt = jd2dt(jdd);
        int year = dt.year;
        int month = dt.month;
        int day = dt.day;
        return {year, month, day};
    }

}

#endif // GCAL_HPP_