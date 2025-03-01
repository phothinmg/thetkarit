#include "include/bcal.h"

#include <iostream>
#include <string>
#include <vector>
#include <math.h>

namespace tk
{
  int Bcal::by2ky(int by) { return by + 3739; };
  int Bcal::by2ssy(int by) { return by + 1182; };
  float Bcal::era_id(int by)
  {
    float id = 1.1;
    if (by >= 1312)
    {
      id = 3;
    }
    else if (by < 1312 && by >= 1217)
    {
      id = 2;
    }
    else if (by < 1217 && by >= 1100)
    {
      id = 1.3;
    }
    else if (by < 1100 && by >= 798)
    {
      id = 1.2;
    }
    else
    {
      id = 1.1;
    }
    return id;
  }

  int Bcal::search_fme(int by)
  {
    int r = 0;
    auto it = this->_fme_map.find(by);
    if (it != this->_fme_map.end())
    {
      r = it->second;
    }

    return r;
  }
  float Bcal::get_wo(int by)
  {
    float id = this->era_id(by);
    int fme = this->search_fme(by);
    float WO = -1.1 + fme;
    if (id == 3)
    {
      WO = -0.5 + fme;
    }
    else if (id == 2)
    {
    }
    else if (id == 1.3)
    {
      WO = -0.85 + fme;
    }
    return WO;
  }
  int Bcal::get_nm(int by)
  {
    float id = this->era_id(by);
    int NM = -1;
    if (id == 3)
    {

      NM = 8;
    }
    else if (id == 2)
    {

      NM = 4;
    }

    return NM;
  }
  float Bcal::get_ta(int by)
  {
    int nm = this->get_nm(by);
    return (12 - nm) * (this->SY / 12 - this->LM);
  }
  float Bcal::get_tw(int by)
  {
    int nm = this->get_nm(by);
    return this->LM - nm * (this->SY / 12 - this->LM);
  }
  int Bcal::excess_days(int by)
  {
    int edays = (int)(this->SY * this->by2ky(by)) % (int)this->LM; // ed =( SY ( my + 3739 ) ) mod LM
                                                                   /*
                                                                 if ed < TA then
                                                                 ed = ed + LM
                                                                 end if
                                                                  */
    return edays < this->get_ta(by) ? edays + this->LM : edays;
  }
  double Bcal::newyear_time(int by)
  {
    return this->SY * by + this->MO;
  }

  int Bcal::check_warhtat(int by)
  {
    int ed = this->excess_days(by);
    float tw = this->get_tw(by);
    int myt = ed >= tw ? 1 : 0;
    int result = 0;
    if (Bcal::contains(tk::wte_zero, by))
    {
      result = 0;
    }
    else if (Bcal::contains(tk::wte_one, by))
    {
      result = 1;
    }
    else
    {
      result = myt;
    }
    return result;
  }

  int Bcal::search_wfm(int by)
  {
    return round(this->newyear_time(by) - this->excess_days(by) + 4.5 * this->LM + this->get_wo(by));
  }

  std::tuple<int, double, int, int> Bcal::get_yeardata(int by)
  {
    int a = this->check_warhtat(by);
    int b1 = this->search_wfm(by);
    int c = 0;
    int L = 0;
    int bs = 0;

    for (int i = 1; i < 4; i++)
    {
      bs = this->search_fme(by - i);
      c = this->check_warhtat(by - i);
      L = i;
      if (c == 1)
      {
        break;
      }
    }
    int b3 = (b1 - bs) % 354;
    int myt = a == 0 ? a : floor(b3 / 31) + a;
    int fm = a == 1 ? b1 : bs + 354 * L;
    int err = a == 1 && b3 != 31 && b3 != 30 ? 1 : 0;
    double tg1 = bs + 354 * L - 102;
    return std::tuple<int, double, int, int>(myt, tg1, fm, err);
  }

  int Bcal::moth_length(int myt, int bm)
  {
    /* စုံ = ၃၀ မ = ၂၉ */
    int ml = 30 - (bm % 2);
    /*
     ဝါကြီးထပ်နှစ်အတွက် နယုန်လတွင်တစ်ရက်ပေါင်း
     29 + 1 = 30 days
     */
    if (bm == 3)
    {
      ml += floor(myt / 2);
    }
    return ml;
  }
  tk::J2B Bcal::g2b(int jdn)
  {
    int j = round(jdn);
    int by = floor((j - 0.5 - this->MO) / this->SY); // return - burmese year
    int myt, fm, err;
    double tg1;
    std::tie(myt, tg1, fm, err) = this->get_yeardata(by);
    double dd = j - tg1 + 1;
    int b = floor(myt / 2);
    int c = floor(1 / (myt + 1));
    int byl = 54 + (1 - c) * 30 + b; // return - burmese year lenght
    int bmt = floor((dd - 1) / byl); // return month type: late =1 or early = 0
    dd -= bmt * byl;
    int a = floor((dd + 423) / 512);
    int bm = floor((dd - b * a + c * a * 30 + 29.26) / 29.544); // burmese month
    int e = floor((bm + 12) / 16);
    int f = floor((bm + 11) / 16);
    int bd = dd - floor(29.544 * bm - 29.26) - b * e + c * f * 30;    // return burmese date
    bm += f * 3 - e * 4 + 12 * bmt;                                   // return adjust month numbers for late months
    int bml = this->moth_length(myt, bm);                             // return length of Burmese month
    int mp = floor((bd + 1) / 16) + floor(bd / 16) + floor(bd / bml); // return Moon Phase
    int fd = bd - 15 * floor(bd / 16);                                // return fortnight day [1-15]
    int ssy = by + 1182;                                              // return Sasana Year ( Buddhist Era - BE)
    int tdkfm = (int)(fm + 89);
    bool warDwin = jdn >= fm && jdn <= tdkfm; // return
    int byt = myt;
    std::string bm_str = tk::b_month_name[bm];
    std::string mp_str = tk::moon_phases[mp];

    return tk::J2B{ssy, by, byt, byl, bm, bmt, bml, bd, fd, mp, fm, bm_str, mp_str};
  }

}

// int main(){
//   tk::Bcal bcal;
//   int fme = bcal.search_fme(1386);
//   std::cout << fme << std::endl;
//   return 0;
// }