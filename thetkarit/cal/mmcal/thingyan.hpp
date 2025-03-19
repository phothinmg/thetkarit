#ifndef THINGYAN_HPP_
#define THINGYAN_HPP_

#include <cmath>
#include <stdexcept>

using namespace std;

namespace tg
{
   
    struct TgTime
    {
        double akyo_day;
        double akya_dayTime;
        double akyat_day;
        double akyat_day2;
        double atat_dayTime;
        double newyear_day;
       
    };
   
    TgTime tg_time(int by)
    {
        double SY = 365.2587564814815;
        double MO = 1954168.050623;
        int BGNTG = 1100; // start of Thingyan
        int SE3 = 1312;   // Burmese year of changing Atar Time.
        if (by < BGNTG)
        {
            throw invalid_argument("Burmese Year " + to_string(by) + " is less than " + to_string(BGNTG) + ". Thingyan was started Burmese Year of " + to_string(BGNTG) + ".");
        }
        double atat_dayTime = SY * by + MO;
        double atar_time = by >= SE3 ? 2.169918982 : 2.1675;
        double akya_dayTime = atat_dayTime - atar_time;
        double akyo_day = round(akya_dayTime - 1);
        double akyat_day = round(akya_dayTime + 1);
        double akyat_day2 = 0.0;
        if(atat_dayTime - akya_dayTime > 2){
            akyat_day2 = round(akya_dayTime + 2);
        }
        double newyear_day = round(atat_dayTime + 1);

        return {akyo_day,akya_dayTime,akyat_day,akyat_day2,atat_dayTime,newyear_day};
       
    }
} // namespace tg

#endif // THINGYAN_HPP_