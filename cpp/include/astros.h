#ifndef ASTROS_H
#define ASTROS_H
#include <iostream>
#include <string>
#include <vector>
namespace as {
    std::tuple<int, std::string> _mahabote(int &by, int &wd);
    std::tuple<int, std::string> _sabbath(int &bd, int &lm);
    std::tuple<int, std::string> _nagahle(int &bm);
    std::tuple<int, std::string> _natkhat(int &by);
    std::tuple<int, std::string> _yatyaza(int &bm, int &wd);
    std::tuple<int, std::string> _pyathada(int &bm, int &wd);
    std::string thamanyo(int &bm, int &wd);
    std::string thamaphyu(int &bd, int &wd);
    std::string amyeittasote(int &bd, int &wd);
    std::string warameittugyi(int &bd, int &wd);
    std::string warameittunge(int &bd, int &wd);
    std::string yatpote(int &bd, int &wd);
    std::string nagapor(int &bd, int &wd);
    std::string yatyotema(int &bm, int &wd);
    std::string mahayatkyan(int &bm, int &wd);
    std::string shanyat(int &bm, int &wd);
    struct astros
    {
        std::vector<std::string> astroDays;
        std::tuple<int, std::string> mahabote;
        std::tuple<int, std::string> nagahle;
        std::tuple<int, std::string> natkhat;
        std::tuple<int, std::string> sabbath;
        std::tuple<int, std::string> yatyaza;
        std::tuple<int, std::string> pyathada;

        astros(std::vector<std::string> astroDays,
               std::tuple<int, std::string> mahabote,
               std::tuple<int, std::string> nagahle,
               std::tuple<int, std::string> natkhat,
               std::tuple<int, std::string> sabbath,
               std::tuple<int, std::string> yatyaza,
               std::tuple<int, std::string> pyathada)
            : astroDays(astroDays),
              mahabote(mahabote),
              nagahle(nagahle),
              natkhat(natkhat),
              sabbath(sabbath),
              yatyaza(yatyaza),
              pyathada(pyathada)
        {
        }
    };
    astros getAstroDays(int &by,int &bm, int &bd, int &wd, int &lm);
}// namespace as
#endif // ASTROS_H