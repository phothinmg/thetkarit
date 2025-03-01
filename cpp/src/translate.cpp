#include "include/translate.h"

#include <iostream>
#include <string>
#include <vector>
#include <optional>
#include <numeric>
#include <sstream>

namespace trn
{
    std::string tran_str(const std::string &str,  Languages lang)
    {
        std::string sttr;
        if (lang == Languages::English)
        {
            sttr = str;
        }
        else
        {
            auto it = _lang_map.find(str);
            if (it != _lang_map.end())
            {
                sttr = it->second;
            }
        }
        return sttr;
    }
    std::vector<std::string> tran_str_array(const std::vector<std::string> &strs,  Languages lang)
    {
        
        std::vector<std::string> translated;
        for (const auto &str : strs)
        {
            if (lang == English)
            {
                translated.push_back(str);
            }
            else
            {
                auto it = _lang_map.find(str);
                if (it != _lang_map.end())
                {
                    translated.push_back(it->second);
                }
                else
                {
                    translated.push_back(str);
                }
            }
        }
        return translated;
    }
    std::string tran_num(int a,  Languages lang)
    {
     
        std::vector<std::string> b = {"၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"};
        std::string r;

        if (lang == Languages::English)
        {
            r = std::to_string(a);
        }
        else
        {
            std::string aStr = std::to_string(a);
            std::vector<std::string> bb;

            for (char i : aStr)
            {
                int index = i - '0';
                std::string x = b[index];
                bb.push_back(x);
            }
            r = std::accumulate(bb.begin(), bb.end(), std::string());
        }
        return r;
    }
}


