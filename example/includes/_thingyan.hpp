#ifndef TG_HPP_
#define TG_HPP_

#include "converters.hpp"

#include <iostream>
#include <iomanip>
#include <ctime>

using namespace std;
namespace bcapp
{
    void _thingyan()
    {
        int by;
        print("Thingyan(Burmese new year) day and times for a given Burmese year.", color_dark_green);
        println();

        cout << "Enter Burmese Year [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> by; // input year

        TgTime tgTime = tg_time(by);

        Jd2Dt jAkyo = jd2dt(tgTime.akyo_day,0.0);
        tm akyoTime = {};
        akyoTime.tm_year = jAkyo.year - 1900;
        akyoTime.tm_mon = jAkyo.month - 1;
        akyoTime.tm_mday = jAkyo.day;
        mktime(&akyoTime);

        Jd2Dt jAkya = jd2dt(tgTime.akya_dayTime,0.0);
        tm akyaTime = {};
        akyaTime.tm_year = jAkya.year - 1900;
        akyaTime.tm_mon = jAkya.month - 1;
        akyaTime.tm_mday = jAkya.day;
        akyaTime.tm_hour = jAkya.hour;
        akyaTime.tm_min = jAkya.minute;
        akyaTime.tm_sec = jAkya.seconds;
        mktime(&akyaTime);

        Jd2Dt jAkyat = jd2dt(tgTime.akyat_day,0.0);
        tm akyatTime = {};
        akyatTime.tm_year = jAkyat.year - 1900;
        akyatTime.tm_mon = jAkyat.month - 1;
        akyatTime.tm_mday = jAkyat.day;
        mktime(&akyatTime);

        string akyat_day_2 = "";
        if (tgTime.akyat_day2 != 0.0)
        {
            Jd2Dt jAkyat2 = jd2dt(tgTime.akyat_day2,0.0);
            tm akyatTime2 = {};
            akyatTime2.tm_year = jAkyat2.year - 1900;
            akyatTime2.tm_mon = jAkyat2.month - 1;
            akyatTime2.tm_mday = jAkyat2.day;
            mktime(&akyatTime2);
            ostringstream oss;
            oss << put_time(&akyatTime2, "%a, %Y %b %d");
            akyat_day_2 = oss.str();
        }
        //double ddt = 1577917828 / 4320000 * by + 1954168.050623;
        Jd2Dt jAtat = jd2dt(tgTime.atat_dayTime);
        tm atatTime = {};
        atatTime.tm_year = jAtat.year - 1900;
        atatTime.tm_mon = jAtat.month - 1;
        atatTime.tm_mday = jAtat.day;
        atatTime.tm_hour = jAtat.hour;
        atatTime.tm_min = jAtat.minute;
        atatTime.tm_sec = jAtat.seconds;
        mktime(&atatTime);

        Jd2Dt jNy = jd2dt(tgTime.newyear_day,0.0);
        tm nyTime = {};
        nyTime.tm_year = jNy.year - 1900;
        nyTime.tm_mon = jNy.month - 1;
        nyTime.tm_mday = jNy.day;
        mktime(&nyTime);

        print("Akyo Day : ", color_magenta);
        print_color(color_yellow);
        cout << put_time(&akyoTime,"%a, %Y %b %d");
        print_color_reset();
        println();

        print("Akya DayTime : ", color_magenta);
        print_color(color_yellow);
        cout << put_time(&akyaTime,"%a, %Y %b %d %H:%M:%S");
        print_color_reset();
        println();

        print("Akyat Day : ", color_magenta);
        print_color(color_yellow);
        cout << put_time(&akyatTime,"%a, %Y %b %d");
        print_color_reset();
        println();

        print("Akyat Day 2 : ", color_magenta);
        print(akyat_day_2,color_yellow);
        println();

        print("Atat DayTime : ", color_magenta);
        print_color(color_yellow);
        cout << jAtat.year << " " << jAtat.month << " "<< jAtat.day;
        print_color_reset();
        println();

        print("New Year Day : ", color_magenta);
        print_color(color_yellow);
        cout << put_time(&nyTime,"%a, %Y %b %d");
        print_color_reset();
        println();
    }
}

#endif // TG_HPP_