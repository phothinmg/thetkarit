#ifndef GCAL_H
#define GCAL_H

#include <iostream>
#include <string>
#include <vector>

#if defined(_WIN64) || defined(__WIN32__) || defined(_WIN32) || defined(WIN32) || defined(__WINDOWS__) || defined(__TOS_WIN__)
#define TKWINDOW
#include <time.h>
#elif defined(unix) || defined(__unix) || defined(__unix__)
#define TKUNIX
#include <time.h>
#else
#define TKSYSTEMINDEPENDENT // the system might not even have RTC, like microcontrollers

#endif // defined

namespace tk{
    enum Ct
    {
        gregorian,
        julian
    };
    enum Gt
    {
        isg,
        isp,
        isnot
    };

    std::vector<std::string> week_days_long = {
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    };
    std::vector<std::string> week_days_short = {
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    };
    std::vector<std::string> g_months_long = {
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
    std::vector<std::string> g_months_short = {
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

    class Gcal{
        protected:
        Ct _ct;
        float _tz;
        double _jd;
        static double INT(double d);
        static int secularDiff(const int &y);
        static Gt checkGregorian(const int &y, const int &m, const int &d);
        static bool isLeapYear(const int &y);
        static std::vector<int> daysInMonth(const int &y);
        static int weekdayId(double jd);
        template <class C, typename T>
        static bool contains(const C &c, const T &e);
        static std::tuple<int, int, int, int, int, int> getCurrentDt();

    public:
        Gcal();
        static std::tuple<double, int> gregorianToJd(int year, int month, int day, int hour = 12, int minute = 0, int seconds = 0, float tz = 0.0);
        static std::tuple<int, int, int, int, int, int> julianToGergorian(double jd, float tz = 0.0);
        static double unixToJd(time_t ut);
        static time_t jdToUnix(double jd);
        static std::tuple<int, int, int> gregorianToJulianCal(const int &year, const int &month, const int &day);
        static std::tuple<int, int, int> julianToGregorianCal(const int &year, const int &month, const int &day);
        static double jdNow();
        static float ltzOffset();

    };
} // namespace tk


#endif//GCAL_H