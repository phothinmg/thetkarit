#ifndef HLDS_H
#define HLDS_H

#include <iostream>
#include <string>
#include <vector>
#include <math.h>
#include <optional>
namespace hld
{
    std::vector<std::pair<int, std::string>> substitute_days = {
        {2459300, "Tabaung Full Moon Substitute"},
        {2459184, "Armed Forces Day Substitute"}};
    std::vector<int> eid_days = {
        // 2019
        2459062,
        // 2020 **
        2459182

    };
    std::vector<int> depavali_days = {
        // 2019
        2458785};
    template <class C, typename T>
    static bool contains(const C &c, const T &e);

    /// @brief Fixed holidays based on Gregorian calendar
    /// @param y Year
    /// @param m Month
    /// @param d Day
    /// @param aa Storage for holidays
    void fhlds_g(int y, int m, int d, std::vector<std::string> aa);
    /// @brief Fixed holidays based on the traditional Burmese calendar
    /// @param by Burmese Year
    /// @param bm Burmese Month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5,Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,Tabaung=12, Late Tagu=13, Late Kason=14]
    /// @param bd Burmese Day of month [1-30]
    /// @param mp Moon Phase [0=waxing, 1=full moon, 2=waning, 3=new moon]
    /// @param aa Storage for holidays
    void fhlds_b(int by, int bm, int bd, int mp, std::vector<std::string> aa);
    /// @brief Thingyan Holidays
    /// @param jdn Julian Day Number
    /// @param by Burmese Year
    /// @param bmt Burmese Month Date
    void thingyan_hlds(int jdn, int by, int bmt, std::vector<std::string> aa);
    void eid_hlds(int jdn, std::vector<std::string> aa);
    void depavali_hlds(int jdn, std::vector<std::string> aa);
    std::vector<std::string> holidays(int jdn,int y, int m, int d,int by, int bm, int bd, int mp,int bmt);
}// namespace hld
#endif // HLDS_H