// cSpell:disable
#ifndef TRAN_CAL_H
#define TRAN_CAL_H

#include <string>
#include <vector>
#include <unordered_map>
#include <numeric>
#include <sstream>


using namespace std;
namespace trn{
    enum Languages
    {
        English,
        Burmese
    };
    vector<pair<string,string>> _langs={
        {"Sunday", "တနင်္ဂနွေ"}, {"Monday", "တနင်္လာ"}, {"Tuesday", "အင်္ဂါ"}, {"Wednesday", "ဗုဒ္ဓဟူး"}, 
        {"Thursday", "ကြာသပတေး"}, {"Friday", "သောကြာ"}, {"Saturday", "စနေ"}, {"January", "ဇန်နဝါရီ"}, 
        {"February", "ဖေဖော်ဝါရီ"}, {"March", "မတ်"}, {"April", "ဧပြီ"}, {"May", "မေ"}, {"June", "ဇွန်"}, 
        {"July", "ဇူလိုင်"}, {"August", "ဩဂုတ်"}, {"September", "စက်တင်ဘာ"}, {"October", "အောက်တိုဘာ"}, 
        {"November", "နိုဝင်ဘာ"}, {"December", "ဒီဇင်ဘာ"}, {"Tagu", "တန်ခူး"}, {"Kason", "ကဆုန်"}, {"Nayon", "နယုန်"}, 
        {"Waso", "ဝါဆို"}, {"Wagaung", "ဝါခေါင်"}, {"Tawthalin", "တော်သလင်း"}, {"Thadingyut", "သီတင်းကျွတ်"}, {"Tazaungmon", "တန်ဆောင်မုန်း"}, 
        {"Nadaw", "နတ်တော်"}, {"Pyatho", "ပြာသို"}, {"Tabodwe", "တပို့တွဲ"}, {"Tabaung", "တပေါင်း"}, {"First Waso", "ပ-ဝါဆို"},
         {"Late Tagu", "နှောင်းတန်ခူး"}, {"Late Kason", "နှောင်းကဆုန်"}, {"Waxing", "လဆန်း"}, {"Waning", "လဆုတ်"}, {"Full Moon", "လပြည့်"}, 
         {"New Moon", "လကွယ်"}, {"East", "အရှေ့"}, {"West", "အနောက်"}, {"South", "တောင်"}, {"North", "မြောက်"}, {"Binga", "ဘင်္ဂ"}, 
         {"Atun", "အထွန်း"}, {"Yaza", "ရာဇ"}, {"Adipati", "အဓိပတိ"}, {"Marana", "မရဏ"}, {"Thike", "သိုက်"}, {"Puti", "ပုတိ"}, 
         {"Amyeittasote", "အမြိတ္တစုတ်"}, {"Warameittugyi", "ဝါရမိတ္တုကြီး"}, {"Warameittunge", "ဝါရမိတ္တုငယ်"}, {"Thamaphyu", "သမားဖြူ"}, 
         {"Thamanyo", "သမားညို"}, {"Yatpote", "ရက်ပုပ်"}, {"Yatyotema", "ရက်ယုတ်မာ"}, {"Mahayatkyan", "မဟာရက်ကြမ်း"}, {"Nagapor", "နဂါးပေါ်"}, 
         {"Shanyat", "ရှမ်းရက်"}, {"Ogre", "ဘီလူး"}, {"Elf", "နတ်"}, {"Human", "လူ"}, {"Sabbath Eve", "အဖိတ်"}, {"Sabbath", "ဥပုသ်"}, 
         {"Yatyaza", "ရက်ရာဇာ"}, {"Pyathada", "ပြဿဒါး"}, {"Afternoon Pyathada", "မွန်းလွဲပြဿဒါး"}, {"Independence Day", "လွတ်လပ်ရေးနေ့"},
         {"Union Day", "ပြည်ထောင်စုနေ့"}, {"Peasants' Day", "တောင်သူလယ်သမားနေ့"}, {"Labour Day", "အလုပ်သမားနေ့"}, {"Martyrs' Day", "အာဇာနည်နေ့"},
         {"Holiday", "ရုံးပိတ်ရက်"}, {"Armed Forces Day", "တပ်မတော်နေ့"}, {"New Year's Day", "နှစ်သစ်ကူးရုံးပိတ်ရက်"}, {"Christmas", "ခရစ္စမတ်နေ့"}, 
         {"Burmese New Year's Day", "နှစ်ဆန်း"}, {"Thingyan Atat", "သင်္ကြန်အတက်နေ့"}, {"Thingyan Akyat", "သင်္ကြန်အကြတ်နေ့"}, 
         {"Thingyan Akya", "သင်္ကြန်အကျနေ့"}, {"Thingyan Akyo", "သင်္ကြန်အကြိုနေ့"}, {"Eid al-Adha", "အိဒ်နေ့"}, {"Deepavali", "ဒီဝါလီ"}, 
         {"Buddha Day", "ဗုဒ္ဓနေ့"}, {"Beginning of Buddhist Lent", "ဓမ္မစကြာနေ့"}, {"End of Buddhist Lent", "သီတင်းကျွတ်မီးထွန်းပွဲ"}, 
         {"Tazaungdaing", "တန်ဆောင်တိုင်"}, {"National Day", "အမျိုးသားနေ့"}, {"Karen New Year's Day", "ကရင်နှစ်သစ်ကူး"}, {"Tabaung Pwe", "တပေါင်းပွဲ"},
         {"Special Holiday","အထူးရုံးပိတ်ရက်"},{"Substitute Working-day","အစားထိုးရုံးဖွင့်ရက်"}
    };
    unordered_map<string, string> _lang_map = []() {
        unordered_map<string, string> map;
        for (const auto& pair : _langs) {
            map[pair.first] = pair.second;
        }
        return map;
    }();
    string tran_str(string str,  Languages lang)
    {
        string sttr;
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
    vector<string> tran_str_array(vector<string> strs,  Languages lang)
    {
        
        vector<string> translated;
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
    string tran_num(int a,  Languages lang)
    {
     
        vector<string> b = {"၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"};
        string r;

        if (lang == Languages::English)
        {
            r = to_string(a);
        }
        else
        {
            string aStr = to_string(a);
            vector<string> bb;

            for (char i : aStr)
            {
                int index = i - '0';
                string x = b[index];
                bb.push_back(x);
            }
            r = accumulate(bb.begin(), bb.end(), string());
        }
        return r;
    }
}// namespace trn

#endif//TRAN_CAL_H