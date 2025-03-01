#ifndef BCAL_H
#define BCAL_H

#include "gcal.h"

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>


namespace tk
{
    struct J2B{
       int ssy;
       int by;
       int byt;
       int byl;
       int bm;
       int bmt;
       int bml;
       int bd;
       int fd;
       int mp;
       int fm;
       std::string bm_str;
       std::string mp_str;
    };
    std::vector<std::string> b_month_name = {
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
    std::vector<std::string> moon_phases = {
        "Waxing", "Full Moon", "Waning", "New Moon"};

    /// @brief The second full moon of Waso, which was in conflict with the calendar advisory group, must be checked and filled in every year.
    std::vector<std::pair<int, int>> _fme = {
        {1377, 1}, //
        {1234, 1},
        {1261, -1},
        {1120, 1},
        {1126, -1},
        {1150, 1},
        {1172, -1},
        {1207, 1},
        {813, -1},
        {849, -1},
        {851, -1},
        {854, -1},
        {927, -1},
        {933, -1},
        {936, -1},
        {938, -1},
        {949, -1},
        {952, -1},
        {963, -1},
        {968, -1},
        {1039, -1},
        {205, 1},
        {246, 1},
        {471, 1},
        {572, -1},
        {651, 1},
        {653, 2},
        {656, 1},
        {672, 1},
        {729, 1},
        {767, -1}};
    /// @brief Warhtat Exceptions
    std::vector<int> wte_one = {1201, 1263, 1344};
    std::vector<int> wte_zero = {1202, 1264, 1345};
    struct Wonm{
       float WO;
       int NM;
    };
    class Bcal : public Gcal
    {
    private:
    /// @brief  The length of a solar year in the Burmese calendar is defined as 1577917828/4320000 (365.2587565) days [Irwin, 1909].
    double SY = 1577917828 / 4320000;
    /// @brief  The length of a lunar month in the Burmese calendar is defined as 1577917828/53433336 (29.53058795) days [Irwin, 1909].
    double LM = 1577917828 / 53433336;
    /// @brief Estimated Julian Date value of the starting time of the Burmese year zero [Yan Naing Aye,2013]
    double MO = 1954168.050623;
    std::unordered_map<int, int> _fme_map = [] (){
        std::unordered_map<int, int> map;
        for (const auto& pair : _fme) {
            map[pair.first] = pair.second;
        }
        return map;
    }();
    int search_fme(int by);
    protected:
    /// @brief Burmese calendar era id
    /// @param by Burmese Year
    /// @return era id
    float era_id(int by);
    /// @brief Warhtat offset to compensate
    /// @param by Burmese Year
    /// @return Warhtat offset
    float get_wo(int by);
    /// @brief Number of months to find excess days
    /// @param by Burmese Year
    /// @return Number of months
    int get_nm(int by);
    /// @brief  ရက်ပိုညှိကိန်း TA
    /// @param by Burmese Year
    /// @return  The number of excess days for past 4 lunar month before the beginning of a Burmese year
    float get_ta(int by);
    /// @brief ဝါထပ်ကိန်း TW
    /// @param by Burmese Year
    /// @return The threshold to determine whether the excess days exceeds within the next 8 months of a Burmese year.
    float get_tw(int by);
    /// @brief The number of excess days of a Burmese year
    /// @param by Burmese Year
    /// @return Excess days
    int excess_days(int by);
    /// @brief Checking a year for intercalary month or not
    /// @param by Burmese Year
    /// @return [1=warhtat, 0=common]
    int check_warhtat(int by);
    /// @brief Get leap year or year data base on given Burmese year
    /// @param by Burmese Year
    /// @return  [myt = type of Burmese Year][tg1 = first day of Tagu][fm = Full moon day of 2ndWaso][err = Error message]
    std::tuple<int,double,int,int> get_yeardata(int by);
    /// @brief Calculate the length of a month in the Burmese calendar.
    /// @param yt The type of the Burmese year.
    /// @param bm The month in the Burmese calendar [0-14].
    /// @return The length of the month (30 for even months, 29 for odd months, with adjustments for "Nayon"=30 for "Big Warhtat").
    int moth_length(int yt,int bm);
   
    public:
    Bcal() = default;
    /// @brief Burmese Year to Kali Yuga year
    /// @param by Burmese year
    /// @return Kali Yuga year
    int by2ky(int by);
    /// @brief Burmese Year to Sasana Year ( Buddhist Era - BE)
    /// @param by Burmese Year
    /// @return Sasana Year
    int by2ssy(int by);
    /// @brief The Julian Day Number of the beginning of a Burmese year.
    /// @param by Burmese Year
    /// @return The Julian Day Number of the beginning of the given Burmese year.
    double newyear_time(int by);
    /// @brief  Full moon day of 2nd Warso(Leap) or  Warso
    /// @param by Burmese Year
    /// @return Full moon day of 2nd Warso(Leap) or  Warso in JDN.
    int search_wfm(int by);
    tk::J2B g2b(int jdn);
    
    };

} // namespace tk

#endif