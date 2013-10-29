#Tower Game

##About

I'm writing this game to learn (by trial and error more than by any example) how
to build a game. It's a basic tower defense game, with rounds of baddies that 
file past on a pre-determined path, and towers the player can set up anywhere
except the path that try to shoot the baddies down before they reach a finish
line.

##Installation

Put the files somewhere and access index.html. The require.js stuff tends to 
work best when you serve it via an HTTPD server rather than accessing them
locally. (I use the default Apache2 in OS X.)

##Next Steps
Major next steps include finishing tower logic (placement restrictions, 
upgrades, and targeting strategies) and swapping out the HTML-based graphics I
used to bootstrap things for something in Canvas or SVG.