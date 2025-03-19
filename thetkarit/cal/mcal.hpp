#ifndef MCAL_HPP_
#define MCAL_HPP_

#include "mmcal/hlds.hpp"
#include "mmcal/astros.hpp"
#include "mmcal/trans.hpp"
#include "mmcal/fmewte.hpp"
#include "mmcal/thingyan.hpp"

#include <string>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <algorithm>
#include <iomanip>

using namespace std;

namespace mcal
{
    using hlds::holidays;

    using as::Astros;
    using as::getAstro;

    using trn::Burmese;
    using trn::English;
    using trn::Languages;
    using trn::tran_num;
    using trn::tran_str;
    using trn::tran_str_array;

    using fwt::searchFme;
    using fwt::wte_one;
    using fwt::wte_zero;

    using tg::TgTime;
    using tg::tg_time;

    /// @brief  The length of a solar year in the Burmese calendar is defined as 1577917828/4320000 (365.2587565) days [Irwin, 1909].
    double SY = 1577917828 / 4320000;
    /// @brief  The length of a lunar month in the Burmese calendar is defined as 1577917828/53433336 (29.53058795) days [Irwin, 1909].
    double LM = 1577917828 / 53433336;
    /// @brief Estimated Julian Date value of the starting time of the Burmese year zero [Yan Naing Aye,2013]
    double MO = 1954168.050623;
    vector<string> b_month_name = {
        "First Waso",
        "Tagu",
        "Kason",
        "Nayon",
        "Waso",
        "Wagaung",
        "Tawthalin",
        "Thadingyut",
        "Tazaungmon",
        "Nadaw",
        "Pyatho",
        "Tabodwe",
        "Tabaung",
        "Late Tagu",
        "Late Kason",
    };
    vector<std::string> moon_phases = {
        "Waxing", "Full Moon", "Waning", "New Moon"};
  
    struct J2B
    {
        int ssy;
        int byt;
        int by;
        int byl;
        int bm;
        int bmt;
        int bml;
        int mp;
        int bd;
        int fd;
        int wsofm;
        bool warDwin;
        string bm_str;
        string mp_str;
    };
    /// @brief Burmese Years ID.
    enum EraIds
    {
        ERA_3 = 3,
        ERA_2 = 2,
        ERA_1_3 = 13, // Assuming 1.3 is represented as 13
        ERA_1_2 = 12, // Assuming 1.2 is represented as 12
        ERA_1_1 = 11  // Assuming 1.1 is represented as 11
    };
    struct GetWoNm
    {
        double WO;
        int NM;
    };
    struct GetTaTw
    {
        float TA; // ရက်ပိုညှိကိန်း TA
        float TW; // ဝါထပ်ကိန်း TW
    };
    struct YearData
    {
        int myt;
        int tg1;
        int fm;
        int err;
    };
 
 
    int by2ky(int by) { return by + 3739; };
    int by2ssy(int by) { return by + 1182; };

    EraIds eraIad(int by)
    {
        if (by >= 1312)
            return EraIds::ERA_3;
        if (by >= 1217)
            return EraIds::ERA_2;
        if (by >= 1100)
            return EraIds::ERA_1_3;
        if (by >= 798)
            return EraIds::ERA_1_2;
        return EraIds::ERA_1_1;
    }
    GetWoNm getWoNm(int by)
    {
        unordered_map<EraIds, GetWoNm> eraConfigurations = {
            {ERA_3, {-0.5, 8}},
            {ERA_2, {-1, 4}},
            {ERA_1_3, {-0.85, -1}},
            {ERA_1_2, {-1.1, -1}},
            {ERA_1_1, {-1.1, -1}},
        };

        EraIds id = eraIad(by); // error handle already here
        return {
            eraConfigurations[id].WO + searchFme(by),
            eraConfigurations[id].NM};
    }
    GetTaTw getTaTw(int by)
    {
        double SY = 1577917828.0 / 4320000.0;  // solar year (365.2587565)
        double LM = 1577917828.0 / 53433336.0; // lunar month (29.53058795)
        int NM = getWoNm(by).NM;
        float TA = static_cast<float>((12 - NM) * (SY / 12 - LM));
        float TW = static_cast<float>(LM - NM * (SY / 12 - LM));
        return {
            TA, TW};
    }

    double excessDays(int by)
    {
        double SY = 1577917828.0 / 4320000.0;  // solar year (365.2587565)
        double LM = 1577917828.0 / 53433336.0; // lunar month (29.53058795)
        int NM = getWoNm(by).NM;
        double TA = (SY / 12 - LM) * (12 - NM); // threshold to adjust
        double ed = fmod(SY * (by + 3739), LM);
        if (ed < TA)
            ed += LM; // adjust excess days
        return ed;
    }
    double newYearTime(int by)
    {
        double SY = 1577917828.0 / 4320000.0; // solar year (365.2587565)
        double MO = 1954168.050623;           // beginning of 0 ME for MMT
        return SY * by + MO;
    }

    template <typename C, typename T>
    bool contains(const C &c, const T &e)
    {
        return end(c) != find(cbegin(c), cend(c), e);
    }
    int checkWarhtat(int by)
    {
        double SY = 1577917828.0 / 4320000.0;  // solar year (365.2587565)
        double LM = 1577917828.0 / 53433336.0; // lunar month (29.53058795)
        double ed = excessDays(by);
        int NM = getWoNm(by).NM;
        EraIds id = eraIad(by);
        double TW = 0;
        if (id >= EraIds::ERA_2)
        {
            TW = LM - NM * (SY / 12 - LM);
        }
        int _wt = ed >= TW ? 1 : 0;
        int r = 0;
        if (contains(wte_one, by))
        {
            r = 1;
        }
        else if (contains(wte_zero, by))
        {
            r = 0;
        }
        else
        {
            r = _wt;
        }

        return r;
    }

    int searchWasoFullMoon(int by)
    {
        double LM = 1577917828.0 / 53433336.0; // lunar month (29.53058795)
        return static_cast<int>(round(newYearTime(by) - excessDays(by) + 4.5 * LM + getWoNm(by).WO));
    }

    YearData getYearData(int by)
    {
        int a = checkWarhtat(by);
        int b1 = searchWasoFullMoon(by);
        int c = 0;
        int L = 0;
        int bs = 0;
        // int i = 0;
        for (int i = 1; i < 4; i++)
        {
            bs = searchWasoFullMoon(by - i);
            c = checkWarhtat(by - i);
            L = i;
            if (c == 1)
            {
                break;
            }
        }
        int b3 = (b1 - bs) % 354;
        int myt = static_cast<int>((a == 0) ? a : std::floor(b3 / 31) + a);
        int fm = (a == 1) ? b1 : bs + 354 * L;
        int err = (a == 1 && b3 != 31 && b3 != 30) ? 1 : 0;
        int tg1 = bs + 354 * L - 102;

        return {myt, tg1, fm, err};
    }
    int monthLength(int byt, int bm)
    {
        int ml = static_cast<int>(30 - fmod(bm, 2)); /* စုံ = ၃၀ မ = ၂၉ */
        if (bm == 3)
        {
            ml += static_cast<int>(floor(byt / 2));
        }
        return ml;
    }

    J2B j2b(double jd)
    {
        double SY = 1577917828.0 / 4320000.0; // solar year (365.2587565)
        double MO = 1954168.050623;
        int j = static_cast<int>(round(jd));

        int by = static_cast<int>(floor((j - 0.5 - MO) / SY)); // return

        YearData yd = getYearData(by);
        double dd = j - yd.tg1 + 1; // ရက်အရေအတွက်
        int b = static_cast<int>(floor(yd.myt / 2));
        int c = static_cast<int>(floor(1 / (yd.myt + 1)));

        int byl = 354 + (1 - c) * 30 + b;                  // return
        int bmt = static_cast<int>(floor((dd - 1) / byl)); // return month type: late =1 or early = 0

        dd -= bmt * byl;

        int a = static_cast<int>(floor((dd + 423) / 512)); // adjust day count and threshold

        int bm = static_cast<int>(floor((dd - b * a + c * a * 30 + 29.26) / 29.544)); // return

        int e = static_cast<int>(floor((bm + 12) / 16));
        int f = static_cast<int>(floor((bm + 11) / 16));

        int bd = static_cast<int>(dd - floor(29.544 * bm - 29.26) - b * e + c * f * 30);    // return
        bm += f * 3 - e * 4 + 12 * bmt;                                                     // adjust month numbers for late months
        int byt = yd.myt;                                                                   // retrun
        int bml = monthLength(byt, bm);                                                     // return
        int mp = static_cast<int>(floor((bd + 1) / 16) + floor(bd / 16) + floor(bd / bml)); // return
        int fd = static_cast<int>(bd - 15 * floor(bd / 16));                                // return
        int ssy = by + 1182;                                                                // return

        int wsofm = yd.fm;
        int tdkfm = wsofm + 89;

        bool warDwin = jd >= wsofm && jd <= tdkfm;

        string bm_str = b_month_name[bm];
        string mp_str = moon_phases[mp];

        return {ssy, byt, by, byl, bm, bmt, bml, mp, bd, fd, wsofm, warDwin, bm_str, mp_str};
    }

} // namespace mcal

#endif // MCAL_H