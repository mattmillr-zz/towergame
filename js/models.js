define(['jquery', 'config', 'utils'], function ($, config, utils) {
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
      self.bf_div = $(self.app.div).children("#battlefield");
      self.jquery = null;
      self.health = self.class_config.health;
      self.value = self.class_config.value;
      
      utils.log('Create Baddie at ' + self.loc.x + ', ' + self.loc.y );
      
      self.addToDiv = function () {
        self.jquery = $("<div></div>");
        self.jquery.addClass('baddie');
        self.jquery.addClass(self.baddie_class);
        self.jquery.css('left', self.loc.x);
        self.jquery.css('top', self.loc.y);
        self.bf_div.append(self.jquery);
      }
      
      self.updateDraw = function () {
        self.jquery.css('left', self.loc.x);
        self.jquery.css('top', self.loc.y);
      }
      
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

        self.updateDraw();
      }
      
      self.takeHit = function (damage) {
        self.health-=damage;
        console.log('Hit!', self.health);
        if (self.health < 0) {
          self.app.youGotMe(self);
        }
      }

      self.remove = function () {
        self.jquery.remove();
      }

      self.addToDiv();
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
      
      self.loc = utils.copyPoint(loc);
      self.firing_radius = utils.circleFromPoint(self.loc, self.range)

      self.bf_div = $(self.app.div).children("#battlefield");
      self.jquery = null;

      self.last_shot = self.app.now;

      self.addToDiv = function () {
        self.jquery = $("<div></div>");
        self.jquery.addClass('tower');
        self.jquery.addClass(self.tower_class);
        self.jquery.css('left', self.loc.x);
        self.jquery.css('top', self.loc.y);
        self.bf_div.append(self.jquery);
      }

      self.shoot = function () {
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
        if (targets.length > 1) {
          // Naieve algo -- hit the first one.
          targets[0].takeHit(self.damage);
          self.last_shot = self.app.now;
        }
      }

      self.update = function () {
        // Can we take a shot?
        if ((self.app.now-self.last_shot) >= 1000/self.rate) {
          self.shoot();
        }
      }

      self.remove = function () {
        self.jquery.remove();
      }

      self.addToDiv();
      return self;
    }
    
    
    return models;

});


