#include "include/astros.h"

#include <iostream>
#include <string>
#include <vector>
#include <math.h>

namespace as
{
    std::tuple<int, std::string> _mahabote(int &by, int &wd)
    {
        static const std::string a[] = {
            "Binga",
            "Ahtun",
            "Yaza",
            "Adipati",
            "Marana",
            "Thike",
            "Puti",
        };
        int index = (by - wd) % 7;
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
    std::tuple<int, std::string> _sabbath(int &bd, int &lm)
    {
        static const std::string a[] = {
            "", "Sabbath", "Sabbath Eve"};
        int index = 0;
        if (bd == 8 || bd == 15 || bd == 23 || bd == lm)
            index = 1;
        if (bd == 7 || bd == 14 || bd == 22 || bd == lm - 1)
            index = 2;
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
    std::tuple<int, std::string> _nagahle(int &bm)
    {
        static const std::string a[] = {
            "West", "North", "East", "South"};
        int m1 = bm;
        if (bm <= 0)
            m1 = 4; // first warso is considered warso
        int index = (floor(m1 % 12)) / 3;
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
    std::tuple<int, std::string> _natkhat(int &by)
    {
        static const std::string a[] = {
            "Ogre", "Elf", "Human"};
        int index = by % 3;
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
    std::tuple<int, std::string> _yatyaza(int &bm, int &wd)
    {
        static const std::string a[] = {
            "", "Yatyaza"};
        int m1 = bm % 4;
        int index = 0;
        int wd1 = (floor(m1 / 2)) + 4;
        int wd2 = (1 - (floor(m1 / 2)) + (m1 % 2)) * (1 + 2 * (m1 % 2));
        if (wd == wd1 || wd == wd2)
            index = 1;
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
    std::tuple<int, std::string> _pyathada(int &bm, int &wd)
    {
        static const std::string a[] = {
            "", "Pyathada", "Afternoon Pyathada"};
        int m1 = bm % 4;
        int index = 0;
        static const int wda[] = {1, 3, 3, 0, 2, 1, 2};
        if (m1 == 0 && wd == 4)
        {
            index = 2; // afternoon pyathada
        }
        else if (m1 == wda[wd])
        {
            index = 1;
        }
        std::string str = a[index];
        return std::tuple<int, std::string>(index, str);
    }
  std::string thamanyo(int &bm, int &wd)
    {
        int bmt = floor(bm / 13);
        bm = bm % 13 + bmt; // to 1-12 with month type
        int m1 = bm - 1 - floor(bm / 9);
        int wd1 = (m1 * 2 - static_cast<int>(floor(m1 / 8))) % 7;
        int wd2 = (wd + 7 - wd1) % 7;
        if (wd2 <= 1)
        {
            return "Thamanyo";
        }
    }
  std::string thamaphyu(int &bd, int &wd)
    {
        int mf = bd - 15 * (floor(bd / 16));
        static const int wda[] = {1, 2, 6, 6, 5, 6, 7};
        static const int wdb[] = {0, 1, 0, 0, 0, 3, 3};
        if (mf == wda[wd] || mf == wdb[wd] || (mf == 4 && wd == 5))
        {
            return "Thamaphyu";
           
        }
    }
  std::string amyeittasote(int &bd, int &wd)
    {
        int mf = bd - 15 * (floor(bd / 16));
        static const int wda[] = {5, 8, 3, 7, 2, 4, 1};
        if (mf == wda[wd])
        {
           return "Amyeittasote";
        }
    }
  std::string warameittugyi(int &bd, int &wd)
    {
        int mf = bd - 15 * (floor(bd / 16));
        static const int wda[] = {7, 1, 4, 8, 9, 6, 3};
        if (mf == wda[wd])
        {
            return "Warameittugyi";
        }
    }
  std::string warameittunge(int &bd, int &wd)
    {
        int mf = bd - 15 * (floor(bd / 16));
        int wn = (wd + 6) % 7;
        if (12 - mf == wn)
        {
            return "Warameittunge";
        }
    }
  std::string yatpote(int &bd, int &wd)
    {
        int mf = bd - 15 * (floor(bd / 16));
        static const int wda[] = {8, 1, 4, 6, 9, 8, 7};
        if (mf == wda[wd])
        {
            return "Yatpote";
        }
    }
  std::string nagapor(int &bd, int &wd)
    {
        static const int wda[] = {26, 21, 2, 10, 18, 2, 21};
        static const int wdb[] = {17, 19, 1, 0, 9, 0, 0};
        if (
            bd == wda[wd] ||
            bd == wdb[wd] ||
            (bd == 2 && wd == 1) ||
            ((bd == 12 || bd == 4 || bd == 18) && wd == 2))
        {
            return "Nagapor";
        }
    }
  std::string yatyotema(int &bm, int &bd)
    {
        int mmt = floor(bm / 13);
        bm = bm % 13 + mmt;
        if (bm <= 0)
            bm = 4;                        // first waso is considered waso
        int mf = bd - 15 * floor(bd / 16); // get fortnight day [0-15]
        int m1 = (bm % 2) ? bm : ((bm + 9) % 12);
        m1 = (m1 + 4) % 12 + 1;
        if (mf == m1)
        {
            return "Yatyotema";;
        }
    }
  std::string mahayatkyan(int &bm, int &bd)
    {
        int bm1 = bm;
        if (bm1 <= 0)
            bm1 = 4; // Consider first warso as warso
        int mf = bd - 15 * (floor(bd / 16));
        int m1 = (static_cast<int>(floor((bm1 % 12) / 2) + 4) % 6) + 1;

        if (mf == m1)
        {
            return "Mahayatkyan";
        }
    }
  std::string shanyat(int &bm, int &bd)
    {
        int bmt = floor(bm / 13);
        int bm1 = (bm % 13) + bmt; // Adjust month to 1-12 range
        if (bm1 <= 0)
            bm1 = 4; // Consider first warso as warso
        int mf = bd - 15 * (floor(bd / 16));
        static const int sya[] = {8, 8, 2, 2, 9, 3, 3, 5, 1, 4, 7, 4};
        if (mf == sya[bm1 - 1])
        {
            return "Shanyat";
        }
    }
    astros getAstroDays(int &by, int &bm, int &bd, int &wd, int &lm)
    {
        std::vector<std::string> astroDays = {
            thamanyo(bm, wd), thamaphyu(bd, wd), amyeittasote(bd, wd), warameittugyi(bd, wd),
            warameittunge(bd, wd), yatpote(bd, wd), yatyotema(bm, bd), nagapor(bd, wd),
            mahayatkyan(bm, bd),
            shanyat(bm, bd)};
       

        std::tuple<int, std::string> mahabote = _mahabote(by, wd);
        std::tuple<int, std::string> nagahle = _nagahle(bm);
        std::tuple<int, std::string> natkhat = _natkhat(by);

        std::tuple<int, std::string> sabbath = _sabbath(bd, lm);
        std::tuple<int, std::string> yatyaza = _yatyaza(bm, wd);
        std::tuple<int, std::string> pyathada = _pyathada(bm, wd);
        return astros(astroDays, mahabote, nagahle, natkhat, sabbath, yatyaza, pyathada);
    }

}