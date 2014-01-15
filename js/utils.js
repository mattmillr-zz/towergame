define(['config'], function (config) {
    var utils = {};


    utils.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }


    utils.guid = function () {
        return utils.s4() + utils.s4() + 
            '-' + utils.s4() + '-' + utils.s4() + 
            '-' + utils.s4() + '-' + utils.s4() + 
            utils.s4() + utils.s4();
    }

    utils.Point = function (x, y) {
      var self = this;
      self.x = x;
      self.y = y;

      self.equals = function (point) {
        return ((point.x == self.x) && (point.y == self.y));
      }

      self.moveToward = function (point, distance) {
        var totalDistance = utils.distance(point, self);
        if (distance > totalDistance) {
          self.x = point.x;
          self.y = point.y;
          return;
        }      
        var ratio = distance / totalDistance;
        var dx = (point.x-self.x) * ratio;
        var dy = (point.y-self.y) * ratio;
        //console.log('self', self.x, self.y, 'point', point.x, point.y, 'd,td,r', distance, totalDistance, ratio, 'd_', dx, dy);
        self.x = self.x + dx;
        self.y = self.y + dy;
      }
      
      return self;
    }

    utils.pointFromArray = function (arr) {
      return new utils.Point(arr[0], arr[1]);
    }

    utils.copyPoint = function (point) {
      return new utils.Point(point.x, point.y);
    }

    utils.randomPointInRange = function (point, range) {
      x = point.x + (Math.random() * 2 * range) - range;
      y = point.y + (Math.random() * 2 * range) - range;
      return new utils.Point(x, y)
    }

    utils.distance = function (p1, p2) {
      var dx = Math.abs(p1.x - p2.x);
      var dy = Math.abs(p1.y - p2.y);
      var d = Math.sqrt((dx*dx)+(dy*dy));
      return d;
    }
    
    utils.angle = function (p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      var radians = Math.atan2(dy, dx);
      var degrees = radians * 180 / Math.PI;
      return degrees + 90;
    }

    utils.Circle = function (x, y, radius) {
      var self = this;
      self.center = new utils.Point(x, y);
      self.radius = radius;
      
      self.diameter = function () {
        return self.radius * 2;
      }
      
      self.containsPoint = function(point) {
        return utils.distance(point, self.center) <= self.radius;
      }
      
      return self;
    }
 
    utils.circleFromPoint = function (point, radius) {
      return new utils.Circle(point.x, point.y, radius);
    }

    utils.Rectangle = function (x1, y1, x2, y2) {
      var self = this;      
      
      if (x1 > x2) { var swap = x1; x2 = x1; x1 = swap; }
      if (y1 > y2) { var swap = y1; y2 = y1; y1 = swap; }
      
      self.x1 = x1;
      self.y1 = y1;
      self.x2 = x2;
      self.y2 = y2;
      
      self.height = function () {
        return self.y2 - self.y1;
      }
      self.width = function () {
        return self.x2 - self.x1;
      }
      self.containsPoint = function(point) {
        return ((point.x >= self.x1) && (point.x <= self.x2)
              && (point.y >= self.y1) && (point.y <= self.y2));
      }
      
      self.containsCircle = function(circle) {
        return ((circle.center.x >= (self.x1 + circle.radius)) && (point.x <= (self.x2 - circle.radius))
              && (point.y >= (self.y1 + circle.radius)) && (point.y <= (self.y2 - cricle.radius)));
      }
      
      self.touchesCircle = function (circle) {
        return ((circle.center.x >= (self.x1 - circle.radius)) && (point.x <= (self.x2 + circle.radius))
              && (point.y >= (self.y1 - circle.radius)) && (point.y <= (self.y2 + cricle.radius)));
      }
      
      return self;
    }

    utils.log = function (loggable) {
      if (config.utils) {
        if (config.utils.log_to_console) {
          console.log(loggable);
        }
      };

    }

    utils.getClass = function (obj) {
      if (typeof obj === "undefined")
        return "undefined";
      if (obj === null)
        return "null";
      return Object.prototype.toString.call(obj)
        .match(/^\[object\s(.*)\]$/)[1];
    }

    return utils;
});
