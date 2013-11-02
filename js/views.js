define(['jquery', 'config', 'utils'], function ($, config, utils) {
    var views = {};



    views.Baddie = function (baddie_model) {
      var self = this;
      self.baddie = baddie_model;
      self.jquery = null;
      self.bf_div = $(self.baddie.app.div).children("#battlefield");
      
      self.addToDiv = function () {
        self.jquery = $("<div></div>");
        self.jquery.addClass('baddie');
        self.jquery.addClass(self.baddie.baddie_class);
        self.jquery.css('left', self.baddie.loc.x);
        self.jquery.css('top', self.baddie.loc.y);
        self.bf_div.append(self.jquery);
      }
      
      self.updateDraw = function () {
        self.jquery.css('left', self.baddie.loc.x);
        self.jquery.css('top', self.baddie.loc.y);
      }

      self.remove = function () {
        self.jquery.remove();
      }
      
      self.addToDiv();
      return self;
    }
    
    views.Tower = function (tower_model) {
      var self = this;
      self.tower = tower_model;
      self.jquery = null;
      self.bf_div = $(self.tower.app.div).children("#battlefield");

      self.addToDiv = function () {
        self.jquery = $("<div></div>");
        self.jquery.addClass('tower');
        self.jquery.addClass(self.tower.tower_class);
        self.jquery.css('left', self.tower.loc.x);
        self.jquery.css('top', self.tower.loc.y);
        self.bf_div.append(self.jquery);
      }

      self.updateDraw = function() {
        if (self.tower.rate_limited) {
          x = ' Lim';
        } else {
          x = ' go';
        }
        
        if (self.tower.tried_this_frame) {
          t = ' X';
        } else {
          t = ' -';
        }
        
        self.jquery.html(self.tower.targets_in_range 
          + x + '<br/>' 
          + self.tower.shots_taken + t
        );
      }

      self.remove = function () {
        self.jquery.remove();
      }

      self.addToDiv();
      return self;
    }
    
    return views;

});
    