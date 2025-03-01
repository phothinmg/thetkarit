
#include "include/hlds.h"

#include <iostream>
#include <string>
#include <vector>
#include <math.h>
#include <algorithm>
namespace hld
{
    template <class C, typename T>
    bool contains(const C &c, const T &e) { return std::end(c) != std::find(std::cbegin(c), std::cend(c), e); };
    std::vector<std::string> holidays(int jdn,int y, int m, int d,int by, int bm, int bd, int mp,int bmt)
    { 
        double SY = 1577917828.0 / 4320000.0; // solar year (365.2587565)
        double MO = 1954168.050623;           // beginning of 0 ME
        int BGNTG = 1100;                     // start of Thingyan
        int SE3 = 1312;                       // third era

        double atat = SY * (by + bmt) + MO; // New year time in jd
        double atar = 0;                    // Length of new year festival
        if (by >= SE3)
        {
            atar = atat - 2.169918982;
        }
        else
        {
            atar = atat - 2.1675;
        }

        int akyaNay = floor(atar); // akyaNay in jd
        int atatNay = floor(atat); // atatNay in jd

        std::vector<std::string> aa;
        if (y > 2018 && m == 1 && d == 1)
        {
            aa.push_back("New Year's Day");
        }
        else if (y >= 1948 && m == 1 && d == 4)
        {
            aa.push_back("Independence Day");
        }
        else if (y >= 1947 && m == 2 && d == 12)
        {
            aa.push_back("Union Day");
        }
        else if (y >= 1958 && m == 3 && d == 2)
        {
            aa.push_back("Peasants' Day");
        }
        else if (y >= 1945 && m == 3 && d == 27)
        {
            aa.push_back("Armed Forces Day");
        }
        else if (y >= 1923 && m == 5 && d == 1)
        {
            aa.push_back("Labour Day");
        }
        else if (y >= 1947 && m == 7 && d == 19)
        {
            aa.push_back("Martyrs' Day");
        }
        else if (y >= 1752 && m == 12 && d == 25)
        {
            aa.push_back("Christmas");
        }
        
        if (bm == 2 && mp == 1)
        {
            aa.push_back("Buddha Day");
        } // kason full moon day,Vesak
        else if (bm == 4 && mp == 1)
        {
            aa.push_back("Dhammasekya Day");
        } // full moon day of waso, Beginning of Buddhist Lent
        else if (bm == 7 && mp == 1)
        {
            aa.push_back("Thadingyut Full Moon Day");
        } // the end of the Buddhist lent.
        else if (by >= 1379 && bm == 7 && (bd == 14 || bd == 16))
        {
            aa.push_back("Thadingyut Holiday");
        } // Pre-Full Moon Day and Post-Full Moon Day
        else if (bm == 8 && mp == 1)
        {
            aa.push_back("Tazaungmon Full Moon Day");
        } // Full Moon Day of Tazaungmon
        else if (by >= 1379 && bm == 8 && bd == 14)
        {
            aa.push_back("Tazaungdaing Holiday");
        } // Pre-Full Moon Day
        else if (by >= 1282 && bm == 8 && bd == 25)
        {
            aa.push_back("National Day");
        } // Commemorates the anniversary of the first university student strike at Rangoon University in 1920.
        else if (bm == 10 && bd == 1)
        {
            aa.push_back("Karen New Year's Day");
        }
        else if (bm == 12 && mp == 1)
        {
            aa.push_back("Tabaung Pwe");
        } // Full Moon Day of Tabaung

        if (by >= SE3)
        {
            atar = atat - 2.169918982;
        }
        else
        {
            atar = atat - 2.1675;
        }

    

        if (jdn == atatNay + 1)
        {
            aa.push_back("Burmese New Year's Day");
        }

        if (by + bmt >= BGNTG)
        {
            if (jdn == atatNay)
            {
                aa.push_back("Thingyan Atat");
            }
            else if (jdn > akyaNay && jdn < atatNay)
            {
                aa.push_back("Thingyan Akyat");
            }
            else if (jdn == akyaNay)
            {
                aa.push_back("Thingyan Akya");
            }
            else if (jdn == akyaNay - 1)
            {
                aa.push_back("Thingyan Akyo");
            }
            else if (by + bmt >= 1369 && by + bmt < 1379 && (jdn == akyaNay - 2 || (jdn >= atatNay + 2 && jdn <= akyaNay + 7)))
            {
                aa.push_back("Thingyan Holiday"); // conditional add thingyan holidays
            }
            else if (by + bmt >= 1384 &&
                     by + bmt <= 1385 &&
                     (jdn == akyaNay - 5 ||
                      jdn == akyaNay - 4 ||
                      jdn == akyaNay - 3 ||
                      jdn == akyaNay - 2))
            {
                aa.push_back("Thingyan Holiday"); // conditional add thingyan holidays
            }
            else if (by + bmt >= 1386 && jdn >= atatNay + 2 && jdn <= akyaNay + 7)
            {
                aa.push_back("Thingyan Holiday"); // conditional add thingyan holidays
            }
        }
        if (contains(eid_days, jdn))
        {
            aa.push_back("Eid al-Adha");
        }

        if (contains(depavali_days, jdn))
        {
            aa.push_back("Deepavali");
        }



        return aa;
    }

}

// int main()
// {
//     std::vector<std::string> ss = hld::holidays(2460719,2025,3,27,1386,13,15,1,0);
    
   
//     for (const auto& s : ss) {
//         std::cout << s << std::endl;
//     }
    
//     return 0;
// }