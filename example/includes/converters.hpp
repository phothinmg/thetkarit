#ifndef CONVERTERS_HPP_
#define CONVERTERS_HPP_

#include "../../thetkarit/bcal.hpp"
#include <iostream>
#include <sstream>
#include <string>
#include <iomanip>

using namespace std;

namespace bcapp
{

    using bcal::Dt2Jd;
    using bcal::Jd2Dt;
    using bcal::Ymd;
    using bcal::BcalInfo;
    using bcal::TgTime;

    using bcal::gregorian;
    using bcal::julian;
    using bcal::English;

    using bcal::cal_convert;
    using bcal::dt2jd;
    using bcal::jd2dt;
    using bcal::bcalInfo;

    using bcal::tg_time;

    using bcal::print;
    using bcal::print_color;
    using bcal::print_color_reset;
    using bcal::println;

    void dt_to_jd()
    {
        int year, month, day;
        print("DateTime ==> JD & JDN", color_yellow);
        println();

        cout << "Enter Year [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> year; // input year

        cout << "Enter Month [";
        print("required", color_pink);
        cout << "] [1-12] : ";
        cin >> month;

        cout << "Enter Day [";
        print("required", color_pink);
        cout << "] [1-31] :  ";
        cin >> day;

        cin.ignore(); // Add this line to ignore the newline character

        cout << "Enter hour [";
        print("optional ", color_pink);
        print("default = 12", color_yellow);
        cout << "] [0-23] :  ";
        int hour = 12;
        string _h;
        getline(cin, _h);
        if (!_h.empty())
        {
            istringstream stream(_h);
            stream >> hour;
        }

        cout << "Enter minute [";
        print("roptional ", color_pink);
        print("default = 0", color_yellow);
        cout << "] [0-59] :  ";
        int minute = 0;
        string _m;
        getline(cin, _m);
        if (!_m.empty())
        {
            istringstream stream(_m);
            stream >> minute;
        }

        cout << "Enter seconds [";
        print("optional ", color_pink);
        print("default = 0", color_yellow);
        cout << "] [0-59] :  ";
        int seconds = 0;
        string _s;
        getline(cin, _s);
        if (!_s.empty())
        {
            istringstream stream(_s);
            stream >> seconds;
        }

        cout << "Enter timezone offset [";
        print("optional ", color_pink);
        print("default = 0.0", color_yellow);
        cout << "] :  ";
        double tz = 0.0;
        string _t;
        getline(cin, _t);
        if (!_t.empty())
        {
            istringstream stream(_t);
            stream >> tz;
        }

        Dt2Jd j = dt2jd(year, month, day, hour, minute, seconds, tz);

        print("JDN : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << j.jdn;
        print_color_reset();
        println();

        print("JD : ", color_magenta);
        print_color(color_yellow);
        cout << setprecision(15) << j.jd;
        print_color_reset();
        println(); // new line
    }

    void jd_to_dt()
    {
        double jd;
        print("Convert from Julian Date or Julian Day Number to date time.", color_dark_green);
        println();

        cout << "Enter JD or JDN [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> jd; // jd or jdn

        cin.ignore(); // Add this line to ignore the newline character

        cout << "Enter timezone offset [";
        print("optional ", color_pink);
        print("default = 0.0", color_yellow);
        cout << "] :  ";
        double tz = 0.0;
        string _t;
        getline(cin, _t);
        if (!_t.empty())
        {
            istringstream stream(_t);
            stream >> tz;
        }

        Jd2Dt dt = jd2dt(jd, tz);

        print("Year : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.year;
        print_color_reset();
        println();

        print("Month : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.month;
        print_color_reset();
        println();

        print("Day : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.day;
        print_color_reset();
        println();

        print("Hour : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.hour;
        print_color_reset();
        println();

        print("Minute : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.minute;
        print_color_reset();
        println();

        print("Seconds : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.seconds;
        print_color_reset();
        println();
    }

    void g_2_j()
    {
        int year, month, day;
        print("Convert Gregorian Calendar date to Julian Calendar date.", color_dark_green);
        println();

        cout << "Enter Year [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> year; // input year

        cout << "Enter Month [";
        print("required", color_pink);
        cout << "] [1-12] :  ";
        cin >> month;

        cout << "Enter Day [";
        print("required", color_pink);
        cout << "] [1-31] :  ";
        cin >> day;

        Ymd dt = cal_convert(julian, year, month, day);

        print("Year : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.year;
        print_color_reset();
        println();

        print("Month : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.month;
        print_color_reset();
        println();

        print("Day : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.day;
        print_color_reset();
        println();
    }

    void j_2_g()
    {
        int year, month, day;
        print("Convert Julian Calendar date to Gregorian Calendar date.", color_dark_green);
        println();

        cout << "Enter Year [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> year; // input year

        cout << "Enter Month [";
        print("required", color_pink);
        cout << "] [1-12] :  ";
        cin >> month;

        cout << "Enter Day [";
        print("required", color_pink);
        cout << "] [1-31] :  ";
        cin >> day;

        Ymd dt = cal_convert(gregorian, year, month, day);

        print("Year : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.year;
        print_color_reset();
        println();

        print("Month : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.month;
        print_color_reset();
        println();

        print("Day : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << dt.day;
        print_color_reset();
        println();
    }

    void g_2_b(){
        int year, month, day;
        print("Convert Gregorian Calendar date to Burmese Calendar date.", color_dark_green);
        println();

        cout << "Enter Year [";
        print("required", color_pink);
        cout << "] :  ";
        cin >> year; // input year

        cout << "Enter Month [";
        print("required", color_pink);
        cout << "] [1-12] :  ";
        cin >> month;

        cout << "Enter Day [";
        print("required", color_pink);
        cout << "] [1-31] :  ";
        cin >> day;

        BcalInfo bd = bcalInfo(year,month,day,English);

        print("Sasana Year : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << bd.sasana_year;
        print_color_reset();
        println();


        print("Burmese Year : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << bd.burmese_year;
        print_color_reset();
        println();

        print("Burmese Month : ", color_magenta);
        print(bd.burmese_month_str,color_yellow);
        println();

        print("Moon Phase : ", color_magenta);
        print(bd.moon_phases_str,color_yellow);
        println();

        print("Fortnight Day : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << bd.fortnight_day;
        print_color_reset();
        println();

        print("Burmese Day : ", color_magenta);
        print_color(color_yellow);
        cout << fixed << setprecision(0) << bd.burmese_day;
        print_color_reset();
        println();

        print("Yatyaza : ", color_magenta);
        if(bd.yatyaza == ""){
            print("false",color_yellow);
        }else{
            print(bd.yatyaza,color_yellow);
        }
        println();

        print("Pyathada : ", color_magenta);
        if(bd.pyathada == ""){
            print("false",color_yellow);
        }else{
            print(bd.pyathada,color_yellow);
        }
        println();

        print("Sabbath : ", color_magenta);
        if(bd.sabbath == ""){
            print("false",color_yellow);
        }else{
            print(bd.sabbath,color_yellow);
        }
        println();

        print("Sabbath School Holiday : ", color_magenta);
        if(bd.is_sabbath_schoolHoliday){
            print("true",color_yellow);
        }else{
            print("false",color_yellow);  
        }
        println();
    }

    void _converters()
    {
        int options = 0;

        print("Choose one of converter : ", color_dark_blue);
        println();

        print("1. ", color_dark_green);
        print("DateTime to JulianDate(JD) and JulianDayNumber(JDN).", color_gray);
        println();

        print("2. ", color_dark_green);
        print("JulianDate(JD) and JulianDayNumber(JDN) to DateTime.", color_gray);
        println();

        print("3. ", color_dark_green);
        print("Gregorian Calendar date to Julian Calendar date", color_gray);
        println();

        print("4. ", color_dark_green);
        print("Julian Calendar date to Gregorian Calendar date", color_gray);
        println();

        print("5. ", color_dark_green);
        print("Gregorian Calendar date to Burmese Calendar date", color_gray);
        println();

        print("Please enter a number [1-5] : ", color_dark_green);
        cin >> options;

        switch (options)
        {
        case 1:
            println();
            dt_to_jd();
            break;
        case 2:
            println();
            jd_to_dt();
            break;
        case 3:
            println();
            g_2_j();
            break;
        case 4:
            println();
            j_2_g();
            break;
        case 5:
            println();
            g_2_b();
            break;
        }
        
    }
}

#endif // CONVERTERS_HPP_