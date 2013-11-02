define(['views', 'config', 'utils'], function (views, config, utils) {
    var models = {};

    models.Baddie = function (baddie_class, app) {
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
      self.health = self.class_config.health;
      self.value = self.class_config.value;
      
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
      }
      
      self.takeHit = function (damage) {
        self.health-=damage;
        console.log('Hit!', self.health);
        if (self.health < 0) {
          self.app.youGotMe(self);
        }
      }

      self.remove = function () {
        self.view.remove();
      }

      self.view = new views.Baddie(self);
      return self;
    }
    
    models.Tower = function (tower_class, loc, app) {
      var self = this;
      self.entity_type = 'tower';
      self.tower_class = tower_class;
      self.class_config = config.towers[tower_class];
      self.app = app;
      
      self.cost = self.class_config[0].cost;
      self.upgrade_cost = self.class_config[1].cost;

      self.level = 0;
      self.rate = self.class_config[self.level].rate;
      self.damage = self.class_config[self.level].damage;
      self.range = self.class_config[self.level].range;
      
      self.targets_in_range = 0;
      self.shots_taken = 0;
      self.rate_limited = false;
      self.tried_this_frame = false;
      
      self.loc = utils.copyPoint(loc);
      self.firing_radius = utils.circleFromPoint(self.loc, self.range)
      
      self.last_shot = self.app.now;

      self.shoot = function () {
        self.tried_this_frame = true;
        
        // Find all the baddies in range
        targets = [];
        for (idx in self.app.entities) {
          entity = self.app.entities[idx];
          if (entity.entity_type == 'baddie') {
            if (self.firing_radius.containsPoint(entity.loc)) {
              targets.push(entity);
            }
          }
        }
        self.targets_in_range = targets.length;
        if (targets.length > 0) {
          // Naieve algo -- hit the first one.
          self.shots_taken += 1;
          targets[0].takeHit(self.damage);
          self.last_shot = self.app.now;
        }
      }

      self.update = function () {
        self.tried_this_frame = false;
        // Can we take a shot?
        if ((self.app.now-self.last_shot) >= 1000/self.rate) {
          self.rate_limited = false;
          self.shoot();
        } else {
          self.rate_limited = true;
        }
        self.view.updateDraw();
      }

      self.remove = function () {
        self.view.remove();
      }
      
      self.view = new views.Tower(self);
      return self;
    }
    
    return models;

});


