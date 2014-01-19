define([], function () {
    var config = {};

    /*

             x
         0--------->
         |
       y |
         |
         V

    */

    config.app = {
      'frame_length': 10,
      'lives': 10,
      'money': 20
    };

    config.firing_indicator_frames = 5;
    config.taking_hit_indicator_frames = 5;

    config.baddies = {
       'alpha': {
          'speed': 30,   // pixels/second
          'health': 70,
          'value': 5
       },
       'beta': {
          'speed': 20,   // pixels/second
          'health': 400,
          'value': 3
       },
       'gamma': {
          'speed': 80,   // pixels/second
          'health': 100,
          'value': 2
       },
    };

    config.waves = [
       {
           'alpha': {'num': 10, 'interval': 650, 'delay': 0}
       },
       {
           'beta': {'num': 7, 'interval': 600, 'delay': 0},
           'gamma': {'num': 15, 'interval': 1200, 'delay': 3000}
       },
       {
           'alpha': {'num': 25, 'interval': 450, 'delay': 0, 'mult': 5}
       },
       {
           'beta': {'num': 8, 'interval': 600, 'delay': 0, 'mult': 3},
           'gamma': {'num': 3, 'interval': 1200, 'delay': 3000, 'mult': 4}
       }       
    ];    
    config.wave_length = 60000;
    config.wave_scatter_interval = 5;
    
    config.battlefield = {
       'width': 640,
       'height': 400,
       'scatter_range': 7,
       'waypoints': [[0,200]
                   , [150,200]
                   , [150,50]
                   , [320,50]
                   , [320,350]
                   , [490,350]
                   , [490,200]
                   , [640,200]
                   ]
    };

    config.towers = {
      'gunner': [
         {'cost': 10, 'rate': 5, 'range': 40, 'damage': 8, 'available': 0},
         {'cost': 15, 'rate': 10, 'range': 60, 'damage': 10, 'available': 0},
         {'cost': 20, 'rate': 12, 'range': 60, 'damage': 15, 'available': 0},
         {'cost': 30, 'rate': 15, 'range': 90, 'damage': 30, 'available': 0},
      ],
      'bomber': [
         {'cost': 25, 'rate': 2, 'range': 70, 'damage': 55, 'available': 1},
         {'cost': 40, 'rate': 3, 'range': 80, 'damage': 60, 'available': 1},
         {'cost': 50, 'rate': 5, 'range': 100, 'damage': 80, 'available': 1},
         {'cost': 75, 'rate': 10, 'range': 130, 'damage': 105, 'available': 1},
      ]
    }

    config.utils = {
      'log_to_console': false
      // 'log_to_div': null
    };

    return config;
});
