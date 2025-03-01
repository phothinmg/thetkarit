#ifndef THETKARIT_H
#define THETKARIT_H

#include "gcal.h"
#include "astros.h"
#include "hlds.h"
#include "translate.h"
#include "bcal.h"

#include <iostream>
#include <string>
#include <vector>
#include <math.h>


namespace tk{
    struct BcalInfo{
        int sasana_year;
        std::string sasana_year_str;
        int burmese_year;
        std::string burmese_year_str;
        int burmese_month_index;
        std::string burmese_month_str;

        
    };
    class Thetkarit : public Bcal{
      private:
      protected:
      public:
      int wd_id(const int &id);

    };
}


#endif // THETKARIT_H