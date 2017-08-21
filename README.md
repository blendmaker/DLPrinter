The whole thing is currently under heavy development and right now not even close to be finished
=
Since about a year now i follow different sources of DIY DLP/SLA printers and decided to start my very own project.
All parts are designed in a way that they are as easy to be printed on a FDM printer as any possible! Also unlike many approaches i want to use different hardware resources as descripted later on.

What's done so far
-
1. Hardware setup
  1. Setup [OrangePi](https://de.aliexpress.com/item/Orange-Pi-Lite-SET7-Orange-Pi-Lite-Transparent-ABS-Case-Power-Cable-8GB-Class-10-Micro/32662461489.html?spm=a2g0x.search0104.3.29.THMouA&ws_ab_test=searchweb0_0,searchweb201602_2_10152_10065_10151_10068_5430020_10304_10307_10137_10060_10302_10155_10154_5370011_10056_10055_10054_10059_100031_10099_5400020_5410011_10103_10102_10052_10053_10142_10107_10050_10051_5380020_10326_10084_10083_10080_10082_10081_10177_10110_10111_5420020_10112_5390011_10113_10114_10312_10313_10314_10315_10078_10079_10073,searchweb201603_4,ppcSwitch_5&btsid=8c0885b5-e103-490e-a7d3-0efbbd7d0d90&algo_expid=1728da27-c923-4d5e-a114-87aa6359754b-3&algo_pvid=1728da27-c923-4d5e-a114-87aa6359754b&transAbTest=ae803_3) with [Armbian 5.30.](https://www.armbian.com/)
  2. Configure Armbian to enable GPIO. WiFi to userlevel roles
  3. Get [Electron](https://electron.atom.io/) - [Electron Quick Start app](https://github.com/electron/electron-quick-start) up and running
  4. Setup and configure [LCD](https://de.aliexpress.com/item/7inch-1024-600-IPS-Screen-LCD-Monitor-TFT-EJ070NA-01J-2AV-HDMI-VGA-for-Raspberry-n/32809145185.html?spm=a2g0s.9042311.0.0.9kLIRD) for UV light projecting
  5. Setup hardware (transistor, resistors) to drive [10W UV Lamp 390nm](https://de.aliexpress.com/item/High-power-LED-chip-UV-COB-Purple-Light-360Nm-370Nm-380Nm-390Nm-400Nm-410Nm-3W-5W/32804292618.html?spm=a2g0s.9042311.0.0.6JSQ4i) from GPIO
  6. Setup Hardware (simple examble setting with capacitor and 1/32 micro steps) to drive DRV8825 stepper driver from GPIO
2. Softwaredevelopment
  1. [Express](http://expressjs.com/) based webserver up and running
  2. Communication between projector/webserver/gpio threads
  3. Communication with GPIO working
3. Design and build
  1. Design of Z axis parts
  2. Build of Z axis parts
  3. Design of first draft of OrangePi expansion board (try to keep rPi compatible)
4. Documentation
  1. created this thing on thingiverse :-D

ToDo:
-
1. Hardware setup
  1. Assemble all parts together as soon, all case parts are done
  2. finish and etch OrangePi expansion board
  3. some testing about burn time with the hardware setup
2. Softwaredevelopment
  1. A damn lot of stuff
  2. Do a nice and usable page for the webserver
  3. Finish work on projector (different input file types possibly)
  4 Improve installation capabilities (propably this project will be running on rPi's, BananaPi's, whatever machines and types)
  5. Upload the whole thing to [github.com](https://github.com)
  6. GCode interpreter planed to reuse slice data from any slicer application (CraftWare, Cura, Slic3r)
  7. Extensible configuration options
  8. BuiltIn SVG slicing capabilities (most likely will integrate [slic3r](http://slic3r.org/) )
  9. Build runner (the actual printing process) into projector thread
3. Documentation
  1. write a BOM
  2. Create a source code documentation
  3. Create a "HowTo Build"

Github repository
-
Even though this thing is not even functional yet, i uploaded a repository on [github](https://github.com/blendmaker/DLPrinter)

BOM (Work in Process):
-
* 12ea. M3x20 screws
* 2ea. Smooth rods
* 1ea. Leadscrew 8mm with nut
* 1ea. Nema17 motor with driver (recommended DRV8825)
* 1ea. Motor capacitor (35v 100uF)
* 1ea. NPN transistor capable of driving the UV LED
* 1ea. UV LED (10W 390nm in testing right now)
* 1ea. Computer (Single bord PCs or whatever, shouldn't matter)
* 1ea. LCD Display (7" 1024x600 in testing right now)
* 1ea. ATX PSU
* 2ea. either LM8uu's or Triffid Hunter's Bushings (see below)
* 1ea. 608z bearing (will propably design a nylon part for this purpose)

a couple of resistors (for the led, as well as pull down transistor) 
