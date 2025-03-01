#include "../include/gcal.h"
#include <iostream>
#include <string>
#include <vector>
#include <math.h>

#ifdef TKWINDOW
#include <windows.h>
#elif defined(TKUNIX)
#include <sys/time.h>
#endif // define

using namespace std;
namespace tk
{
    
    double Gcal::INT(double d)
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
    int Gcal::secularDiff(const int &y)
    {
        return floor(y / 100) - floor(y / 400) - 2;
    }
    Gt Gcal::checkGregorian(const int &y, const int &m, const int &d)
    {

        if (y > 1582 || (y == 1582 && (m > 10 || (m == 10 && d >= 15))))
        {
            return isg;
        }
        else if (y < 1582 || (y == 1582 && (m < 10 || (m == 10 && d <= 4))))
        {
            return isp;
        }
        else if (y == 1582 && m == 10 && d > 4 && d < 15)
        {
            return isnot;
        }
        else
        {
            // Add a default return statement here
            return isg; // or some other default value
        }
    }
    bool Gcal::isLeapYear(const int &y)
    {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }
    std::vector<int> Gcal::daysInMonth(const int &y)
    {
        std::vector<int> cy = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        std::vector<int> ly = {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        std::vector<int> y1582 = {31, 28, 31, 30, 31, 30, 31, 31, 30, 21, 30, 31};
        if (y == 1582)
        {
            return y1582;
        }
        else
        {
            return Gcal::isLeapYear(y) ? ly : cy;
        }
    }
    int Gcal::weekdayId(double jd)
    {
        int _jd = round(jd);
        return (int)(_jd + 1) % 7;
    }
    template <class C, typename T>
    bool Gcal::contains(const C &c, const T &e) { return std::end(c) != std::find(std::cbegin(c), std::cend(c), e); };
    float Gcal::ltzOffset()
    {
        float tzOffset;
#ifdef TKWINDOW
        TIME_ZONE_INFORMATION tzi;
        GetTimeZoneInformation(&tzi);
        tzOffset = -tzi.Bias / 60.0; // convert minutes to hours
#elif defined(TKUNIX)
        time_t mytime = time(0);
        struct tm tm_ptr;
        localtime_r(&mytime, &tm_ptr);
        tzOffset = (double)tm_ptr.tm_gmtoff / 60 / 60;
#endif
        return tzOffset;
    }
    std::tuple<int, int, int, int, int, int> Gcal::getCurrentDt(){
        int y, m, d, h, n, s;
        #ifdef TKWINDOW
        SYSTEMTIME lt;
        GetLocalTime(&lt);
        y = lt.wYear;
        m = lt.wMonth;
        d = lt.wDay;
        h = lt.wHour;
        n = lt.wMinute
        s = lt.wSecond;
#elif defined(TKUNIX)
        time_t mytime = time(0);
        struct tm tm_ptr;
        localtime_r(&mytime, &tm_ptr);
        y = tm_ptr.tm_year + 1900;
        m = tm_ptr.tm_mon + 1;
        d = tm_ptr.tm_mday;
        h = tm_ptr.tm_hour;
        n = tm_ptr.tm_min;
        s = tm_ptr.tm_sec;
#endif
return  std::tuple<int, int, int, int, int, int>(y,m,d,h,n,s);

    }
    double Gcal::jdNow()
    {
        int y, m, d, h, n, s, jdn;
        double jd;
        std::tie(y,m,d,h,n,s) = Gcal::getCurrentDt();
        float tzz = Gcal::ltzOffset();
        std::tie(jd, jdn) = Gcal::gregorianToJd(y, m, d, h, n, s, tzz);
        return jd;
    }

    Gcal::Gcal()
    {
        this->_ct = gregorian;
        this->_jd = Gcal::jdNow();
        this->_tz = Gcal::ltzOffset();
    }
    std::tuple<double, int> Gcal::gregorianToJd(int year, int month, int day, int hour, int minute, int seconds, float tz)
    {
        Gt result = Gcal::checkGregorian(year, month, day);
        if (result == isnot)
        {
            day = 4;
        }
        if (month < 3)
        {
            year = year - 1;
            month = month + 12;
        }
        int a = Gcal::INT(year / 100.0);
        double b = 2 - a + Gcal::INT(a / 4.0);
        float tzos = tz / 24;
        float def = (hour - 12) / 24.0 + minute / 1440.0 + seconds / 86400.0;
        double jd = Gcal::INT(365.25 * (year + 4716)) + Gcal::INT(30.6001 * (month + 1)) + day + b - 1524.5 + tzos + def;
        if (result == isp)
        {
            jd += 10;
        }
        int jdn = round(jd);
        return std::tuple<double, int>(jd, jdn);
    }
    std::tuple<int, int, int, int, int, int> Gcal::julianToGergorian(double jd, float tz)
    {
        double temp = jd + 0.5 + (tz / 24);
        int Z = trunc(temp);
        double F = static_cast<double>(temp - Z);
        int A = Z;
        if (Z >= 2299161)
        {
            double alpha = Gcal::INT((Z - 1867216.25) / 36524.25);
            A = Z + 1 + alpha - INT(alpha / 4);
        }

        int B = A + 1524;
        int C = Gcal::INT((B - 122.1) / 365.25);
        int D = Gcal::INT(365.25 * C);
        int E = Gcal::INT((B - D) / 30.6001);

        int day = B - D - Gcal::INT(30.6001 * E) + F;
        int month = E - 1;
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
        int hour = trunc(P);
        double H = (P - hour) * 60;
        int minute = trunc(H);
        double O = (H - minute) * 60;
        int seconds = round(O);
        return std::tuple<int, int, int, int, int, int>(year, month, day, hour, minute, seconds);
    }
    double Gcal::unixToJd(time_t ut)
    {
        return (2440587.5 + double(ut) / 86400.0);
    }
    time_t Gcal::jdToUnix(double jd)
    {
        return long(floor((jd - 2440587.5) * 86400.0 + 0.5));
    }
    std::tuple<int, int, int> Gcal::gregorianToJulianCal(const int &year, const int &month, const int &day)
    {
        int y, m, d, h, n, s;
        double jd;
        int jdn;
        std::tie(jd, jdn) = gregorianToJd(year, month, day);
        int diff = secularDiff(year);
        double jdd = jd - diff;
        std::tie(y, m, d, h, n, s) = julianToGergorian(jdd);
        return std::tuple<int, int, int>(y, m, d);
    }
    std::tuple<int, int, int> Gcal::julianToGregorianCal(const int &year, const int &month, const int &day)
    {
        int y, m, d, h, n, s;
        double jd;
        int jdn;
        std::tie(jd, jdn) = gregorianToJd(year, month, day);
        int diff = secularDiff(year);
        double jdd = jd + diff;
        std::tie(y, m, d, h, n, s) = julianToGergorian(jdd);
        return std::tuple<int, int, int>(y, m, d);
    }

}

int main()
{
    time_t mytime = time(0);
    struct tm tm_ptr;
    localtime_r(&mytime, &tm_ptr);
    auto tz = tm_ptr.tm_gmtoff;
    auto tzz = tm_ptr.tm_zone;
    double jd = tk::Gcal::jdNow();
    std::string wdd = tk::week_days_long.at(tm_ptr.tm_wday);
    std::cout << wdd << std::endl;
}