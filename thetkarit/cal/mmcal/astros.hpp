// cSpell:disable
#ifndef ASTROS_HPP_
#define ASTROS_HPP_

#include <string>
#include <cmath>

using namespace std;

namespace as
{

    struct Astros
    {
        string mahabote;
        string nagahle;
        string natkhat;
        int sabbath_index;
        string sabbath;
        string yatyaza;
        string pyathada;
    };

    string _mahabote(int by, int wd)
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
        return str;
    }
    struct Sabbath
    {
        int index;
        string str;
    };
    Sabbath _sabbath(int bd, int lm)
    {
        static const std::string a[] = {
            "", "Sabbath", "Sabbath Eve"};
        int index = 0;
        if (bd == 8 || bd == 15 || bd == 23 || bd == lm)
            index = 1;
        if (bd == 7 || bd == 14 || bd == 22 || bd == lm - 1)
            index = 2;
        std::string str = a[index];
        return {index, str};
    }
    string _nagahle(int bm)
    {
        static const std::string a[] = {
            "West", "North", "East", "South"};
        int m1 = bm;
        if (bm <= 0)
            m1 = 4; // first warso is considered warso
        int index = static_cast<int>((floor(m1 % 12)) / 3);
        std::string str = a[index];
        return str;
    }
    string _natkhat(int by)
    {
        static const std::string a[] = {
            "Ogre", "Elf", "Human"};
        int index = by % 3;
        std::string str = a[index];
        return str;
    }
    string _yatyaza(int bm, int wd)
    {
        static const std::string a[] = {
            "", "Yatyaza"};
        int m1 = bm % 4;
        int index = 0;
        int wd1 = static_cast<int>((floor(m1 / 2)) + 4);
        int wd2 = static_cast<int>((1 - (floor(m1 / 2)) + (m1 % 2)) * (1 + 2 * (m1 % 2)));
        if (wd == wd1 || wd == wd2)
            index = 1;
        std::string str = a[index];
        return str;
    }
    string _pyathada(int bm, int wd)
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
        return str;
    }
    Astros getAstro(int by, int bm, int lm, int bd, int wd)
    {
        string mahabote = _mahabote(by, wd);
        string nagahle = _nagahle(bm);
        string natkhat = _natkhat(by);
        int sabbath_index = _sabbath(bd, lm).index;
        string sabbath = _sabbath(bd, lm).str;
        string yatyaza = _yatyaza(bm, wd);
        string pyathada = _pyathada(bm, wd);

        return {mahabote, nagahle, natkhat, sabbath_index, sabbath, yatyaza, pyathada};
    }

}// namespace as

#endif // ASTROS_HPP_