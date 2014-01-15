define(['config', 'models', 'utils'], function (config, models, utils) {

    var bf = {};
    bf.entity_type = 'battlefield';
    bf.jquery = $('div#battlefield');
    bf.geo = new utils.Rectangle(0, 0, config.battlefield.width, config.battlefield.height);

    bf.start = new utils.Point(config.battlefield.start_x, config.battlefield.start_y);
    bf.end = new utils.Point(config.battlefield.end_x, config.battlefield.end_y);
    bf.app = null;
    
    bf.now_placing = null;
    
    bf.canPlace = function (tower_type) {
      available = config.towers[tower_type][0].available;
      cost = config.towers[tower_type][0].cost;
      
      if ((!bf.app.game_over) 
           && (bf.app.wave >= available) 
           && (bf.app.money >= cost)) {
             return true;
      }
      return false;
      
    }
    
    bf.placeStart = function (tower_type) {
      if (!bf.canPlace(tower_type)) { return; } 
      bf.now_placing = tower_type;
      bf.jquery.addClass('aiming');
      bf.jquery.on('mousemove', function (e) {
        var tower = $('.tower.adding');
        if (tower.length < 1) {
          tower = $('<div class="tower adding ' + tower_type + '" />');
          bf.jquery.append(tower);
        }
        tower.css({
          top: e.pageY - 10,
          left: e.pageX - 10
        });
      });
      bf.jquery.on('click.placing', bf.placeClick);
      $(document).on('keyup.placing', function(e) {
        if (e.keyCode == 27) { bf.placeEnd(); }   // esc
      });
    }
    
    bf.placeClick = function (e) {
      loc = utils.Point(e.pageX - 10, e.pageY - 10);
      tower = new models.Tower(bf.now_placing, loc, bf.app);
      bf.app.add(tower);
      bf.app.debit(tower.cost);
      bf.placeEnd();
    }
    
    bf.placeEnd = function () {
      $('.tower.adding').remove();
      bf.jquery.off('mousemove')
      bf.jquery.off('click.placing');      
      bf.jquery.removeClass('aiming');
      $(document).off('keyup.placing');
      $('a.cc_add_tower').removeClass('placing');
      bf.now_placing = null;
    }
    
    bf.setup = function(app) {
      bf.app = app;

      $('a.cc_now').click(bf.app.sendNextWave);

      // Tower buttons
      $('a.cc_add_tower').each(function (index, element) {
        tower_type = $(element).data('tower');
        cost = config.towers[tower_type][0].cost;
        $(element).addClass('disabled');
        $(element).attr('title', '$' + cost);
      });
      $('a.cc_add_tower').click(bf.handle_tower_button_click);
      
      // Keyboard Shortcuts
      $(document).on('keyup.shortcuts', function(e) {
        //console.log(e.keyCode);
        if (bf.now_placing == null) {
          if (e.keyCode == 71) { bf.placeStart('gunner'); } // g
          if (e.keyCode == 66) { bf.placeStart('bomber'); } // b
        }
      });
      
    }
    
    bf.handle_tower_button_click = function (e) {
      if ($(e.currentTarget).hasClass('disabled')) { return false; }
      tower_type = $(e.currentTarget).data('tower');
      bf.placeStart(tower_type);
    }
    
    bf.enable_tower_buttons = function () {
      $('a.cc_add_tower').each(function (index, element) {
        tower_type = $(element).data('tower');
        available = config.towers[tower_type][0].available;
        cost = config.towers[tower_type][0].cost;
        if (bf.canPlace(tower_type)) {
           $(element).removeClass('disabled');
        } else {
          $(element).addClass('disabled');
        }
        if (bf.now_placing != null) {
          if (tower_type == bf.now_placing) {
            $(element).removeClass('disabled');
            $(element).addClass('placing');
          }
        }
        
      });
    }
    
    bf.update = function () {
      // Update the Control Center.
      $('#cc_lives').html(bf.app.lives);
      $('#cc_money').html(bf.app.money);

      $('#cc_wave_num').html(bf.app.wave + 1);
      $('#cc_num_wave').html(config.waves.length);
      
      wave_time_remaining = Math.round(bf.app.wave_time_remaining/1000)
      if (wave_time_remaining < 0) { wave_time_remaining = 0; }
      $('#cc_wave_time_remaining').html(wave_time_remaining);

      $('#cc_score').html(bf.app.score);

      if (bf.app.game_over) {
        if (bf.app.win) {
          $("#lose_message").addClass("hidden");
          $("#win_message").removeClass("hidden");
        } else {
          $("#win_message").addClass("hidden");
          $("#lose_message").removeClass("hidden");
        }
      }
      
      bf.enable_tower_buttons();
    }
    
    bf.remove = function () {
      // do nothing
    }
    
    return bf;

});


