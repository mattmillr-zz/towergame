define(['views', 'config', 'utils'], function (views, config, utils) {

  return function (tower_class, loc, app) {
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
          self.firing_at = targets[0];
          targets[0].takeHit(self.damage);
          self.last_shot = self.app.now;
        }
      }

      self.update = function () {
        self.tried_this_frame = false;
        self.firing_at = null;
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

});


