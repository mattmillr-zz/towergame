// Backbone App - routers and top-level viewmodels;

define(['jquery', 'models', 'utils', 'config', 'battlefield'], 
       function ($, models, utils, config, battlefield) {

    var app = {};

    app.div = null;
    
    app.start = Date.now();
    app.now = Date.now();
    app.last_tick = app.start;
    app.tick_length = 0;
    app.battlefield = battlefield;
    app.waypoints = [];
    app.lives = config.app.lives;
    app.money = config.app.money;
    app.temp = null;
    app.tick_id = null;
    app.wave = -1;
    app.wave_start = Date.now();
    app.game_over = false;
    app.last_wave_away = false;
    app.win = false;
    app.wave_time_remaining = 0;    
    app.entities = [];
    app.baddie_count = 0;
    
    app.add = function(entity) {
      app.entities.push(entity);
    }

    app.deposit = function(amt) {
      app.money = app.money + amt;
    }

    app.debit = function(amt) {
      app.money = app.money - amt;
    }

    app.remove = function(entity) {
      utils.log('remove baddie');
      entity.remove();
      idx = app.entities.indexOf(entity);
      if (idx > -1) { app.entities.splice(idx, 1); }
      delete entity;
    }

    app.scheduleBaddie = function (baddie_type, num, interval, delay) {
      setTimeout(
        function () { 
          if (app.game_over) { return; }
          app.add(new models.Baddie(baddie_type, app)); 
          app.baddie_count++;
        }, 
        delay + (n * interval)
      );
    }

    app.sendNextWave = function () {
            
      app.wave++;

      if (app.wave >= config.waves.length) {
        app.last_wave_away = true;
        return;
      }

      app.wave_start = Date.now();
      
      for (baddie_type in config.waves[app.wave]) {
        num = config.waves[app.wave][baddie_type]['num'];
        interval = config.waves[app.wave][baddie_type]['interval'];
        delay = config.waves[app.wave][baddie_type]['delay'];

        for (n = 0; n < num; n++) {
          
          adj_interval = interval 
            + (Math.random() * 2 * config.wave_scatter_interval) 
            - config.wave_scatter_interval; 
          
          app.scheduleBaddie(baddie_type, num, adj_interval, delay);
        }

      }
      
    }

    app.setup = function () {
      app.battlefield.setup(app);
      app.add(app.battlefield);
      
      // create waypoints
      for(idx in config.battlefield.waypoints) {
        app.waypoints.push(utils.pointFromArray(config.battlefield.waypoints[idx]));
      }

    }
    
    app.iMadeIt = function (entity) {
      app.lives--;
      app.remove(entity);
      app.baddie_count--;
    }
    
    app.youGotMe = function (entity) {
      console.log('You killed a ' + entity.baddie_class);
      app.money += entity.value;
      app.remove(entity);
      app.baddie_count--;
    }
    
    app.gameOver = function () {
      app.game_over = true;
      if (app.lives > 0) {
        app.win = true;
      }
      setTimeout(
        function() { clearInterval(app.tick_id); }, 
        1.5 * config.app.frame_length);
    }

    app.update = function() {
      if (app.last_wave_away && (app.baddie_count <= 0)) {
        app.gameOver();
      }
      if (app.lives <= 0) {
        app.gameOver();
      }
      for (var idx in app.entities) {
        app.entities[idx].update();
      }
    }

    app.tick = function () {
      app.now = Date.now();
      app.tick_length = app.now - app.last_tick;

      wave_time_elapsed = app.now - app.wave_start;
      app.wave_time_remaining = config.wave_length - wave_time_elapsed;
      if ((app.wave == -1) || (app.wave_time_remaining <= 0)) {
        app.sendNextWave();
      }

      app.update()

      app.last_tick = app.now;
    }

    app.run = function() {
      app.div = document.getElementById("app_view");
      app.setup();
      app.tick_id = setInterval(app.tick, config.app.frame_length)
    }

    return app;
});