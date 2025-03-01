#include "include/tkrit.h"

#include "include/gcal.h"
#include "include/astros.h"
#include "include/hlds.h"
#include "include/translate.h"
#include "include/bcal.h"


namespace tk{
    int Thetkarit::wd_id(const int &id){
        return id == 6 ? 0 : id + 1;

    }
}

int main(){
  tk::Thetkarit tkr;
 
  std::cout << tkr.wd_id(6) << std::endl;
  return 0;
}