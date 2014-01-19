define(['views', 'config', 'utils'], function (views, config, utils) {

    return function (baddie_class, mult, app) {
      var self = this;
      self.entity_type = 'baddie';
      self.baddie_class = baddie_class;
      self.class_config = config.baddies[baddie_class];
      self.app = app;
      self.waypoint = 0;
      self.loc = utils.randomPointInRange(
            self.app.waypoints[self.waypoint],
            config.battlefield.scatter_range);
      self.destination = utils.copyPoint(self.loc);
      self.health = self.class_config.health * mult;
      self.full_health = self.class_config.health * mult;
      self.value = self.class_config.value;
      self.taking_hit = 0;
      
      utils.log('Create Baddie at ' + self.loc.x + ', ' + self.loc.y );
      
      self.update = function () {
        
        if (self.loc.equals(self.destination)) {
          self.waypoint++;
          if(self.waypoint >= self.app.waypoints.length) {
            self.app.iMadeIt(self);
            return;
          }
          self.destination = utils.randomPointInRange(
            self.app.waypoints[self.waypoint],
            config.battlefield.scatter_range);
        }
        
        
        var distance = self.class_config.speed / 1000 * self.app.tick_length;
        self.loc.moveToward(self.destination, distance); 

        self.view.updateDraw();
        if (self.taking_hit > 0) { self.taking_hit -= 1; };
      }
      
      self.takeHit = function (damage) {
        self.health-=damage;
        self.taking_hit = config.taking_hit_indicator_frames;
        if (self.health < 0) {
          self.app.youGotMe(self);
        }
      }

      self.remove = function () {
        self.view.remove();
      }

      self.getScore = function () {
        return (self.class_config['health'] + self.class_config['speed']) 
          * self.class_config['value'];
      }

      self.view = new views.Baddie(self);
      return self;
      
    }

});

