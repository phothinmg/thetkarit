#ifndef FMEWTE_HPP_
#define FMEWTE_HPP_

#include <unordered_map>
#include <vector>

using namespace std;
namespace fwt
{

    /// @brief The second full moon of Waso, which was in conflict with the calendar advisory group, must be checked and filled in every year.
    vector<pair<int, int>> fme = {
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
    vector<int> wte_one = {1201, 1263, 1344};
    vector<int> wte_zero = {1202, 1264, 1345};

    /// @brief Map for FME
    unordered_map<int, int> fme_map = []()
    {
        unordered_map<int, int> map;
        for (const auto &pair : fme)
        {
            map[pair.first] = pair.second;
        }
        return map;
    }();

    /// @brief Check fme
    /// @param by
    int searchFme(int by)
    {
        int r = 0;
        auto it = fme_map.find(by);
        if (it != fme_map.end())
        {
            r = it->second;
        }

        return r;
    }

} // fwt
#endif // FMEWTE_HPP_