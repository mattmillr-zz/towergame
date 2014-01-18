define(['jquery', 'config', 'utils'], function ($, config, utils) {

   return function (baddie_model) {
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
      if (self.baddie.taking_hit > 0) {
        self.jquery.addClass('taking-hit');
      } else {
        self.jquery.removeClass('taking-hit');
      }
    }

    self.remove = function () {
      self.jquery.remove();
    }
    
    self.addToDiv();
    return self;
  }
  
});

