
#include "includes/_thingyan.hpp"

using namespace std;

using bcapp::_converters;
using bcapp::_thingyan;
using bcapp::print;
using bcapp::println;


int main()
{
   int options = 0;

   print("1. ", color_dark_green);
   print("Thingyan(Burmese new year) day and times", color_yellow);
   println();

   print("2. ", color_dark_green);
   print("Converters", color_yellow);
   println();

   print("Please enter a number  : ", color_dark_green);
   cin >> options;

   switch (options)
   {
   case 1:
      println();
      _thingyan();
      break;
   case 2:
      println();
      _converters();
      break;
   }

   return 0;
}
