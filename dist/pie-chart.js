/*! pie-chart - v1.0.0 - 2013-10-27
* https://github.com/n3-charts/pie-chart
* Copyright (c) 2013 n3-charts  Licensed ,  */
angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', '$window', function($utils, $window) {
  var link  = function(scope, element, attrs, ctrl) {
    var dim = $utils.getDefaultMargins();

    scope.updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    scope.update = function() {
      scope.updateDimensions(dim);
      scope.redraw(dim);
    };

    scope.redraw = function(dimensions) {
      var data = scope.data;
      var options = scope.options;

      $utils.clean(element[0]);

      if (!data || !options) {
        return;
      }

      var svg = $utils.bootstrap(element[0], dimensions);
      $utils.addTooltip(svg);

      $utils.draw(svg, data, dimensions);
    };

    $window.onresize = function() {
      scope.update();
    };

    scope.$watch('data', scope.update);
    scope.$watch('options', scope.update, true);
  };

  return {
    replace: true,
    restrict: 'E',
    scope: {data: '=', options: '='},
    template: '<div></div>',
    link: link
  };
}]);
angular.module('n3-pie-utils', [])

.factory('$utils', [function() {
  return {getDefaultMargins: function() {
  return {top: 20, right: 50, bottom: 30, left: 50};
},

clean: function(element) {
  d3.select(element).select('svg').remove();
},

bootstrap: function(element, dimensions) {
  d3.select(element).classed('chart', true);
  
  var width = dimensions.width;
  var height = dimensions.height;

  var svg = d3.select(element).append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' +
      (dimensions.width*.5) + ',' +
      (dimensions.height*.5) + ')'
  );
  
  return svg;
},

getRadius: function(dimensions) {
  var d = dimensions;
  
  return Math.min(
    (d.width - d.left - d.right),
    (d.height - d.top - d.bottom)
  )*.5;
},

createContent: function(svg) {
  svg.append('g')
  .attr('class', 'content');
},

draw: function(svg, data, dimensions) {
  var radius = this.getRadius(dimensions);

  var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });


  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");
    
    
  var that = this;
  g.append("path")
    .attr("d", arc)
    .style("stroke", function(d) {return d.data.color;})
    .style("fill", function(d) {return d.data.color;})
    .style("fill-opacity", 0.2)
    .on('mouseover', function(d) {
      // Why the hell are these angles inversed and shifted of PI/2 ???
      var angle = Math.PI*.5 - ((d.endAngle - d.startAngle)*.5 + d.startAngle);
      that.moveTooltip(radius + 10, angle, svg, dimensions);
    })

  g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.value + '%'; });
},

moveTooltip: function(radius, angle, svg) {
  var w = 100;
  var h = 20;
  
  var o = {
    x: radius * Math.cos(angle),
    y: -radius * Math.sin(angle)
  };
  
  var top_left = {x: 0, y: 0, l: 'top_left'};
  var top_right = {x: + w, y: 0, l: 'top_right'};
  var bottom_left = {x: 0, y: + h, l: 'bottom_left'};
  var bottom_right = {x: + w, y: + h, l: 'bottom_right'};
  
  var closest = this.getCloser(
    o, 
    [top_left, top_right, bottom_left, bottom_right]
  );
  
  svg.select('#tooltip')
    .attr({
      'x': o.x - closest.x,
      'y': o.y - closest.y
    });
},

getCloser: function(center, points) {
  var minDist = Number.POSITIVE_INFINITY;
  var closest;
  
  for (var i = 0; i < points.length; i++) {
    var d = this.dist({x: 0, y: 0}, {
      x: center.x + points[i].x,
      y: center.y + points[i].y
    });
    
    if (d < minDist) {
      minDist = d;
      closest = points[i];
    }
  }
  
  return closest;
},

dist: function(a, b) {
  return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
},

_getCoordinates: function(angle) {
  var pi = Math.PI;
  var w = 100;
  var h = 20;
  
  angle = (2*pi)%angle;
  
  if (angle >= 7*pi/4  && angle < pi/4) {
    return {
      x: w/2,
      y: -(w*Math.tan(angle))/2
    };
  }
  
  if (angle >= pi/4  && angle < 3*pi/4) {
    return {
      y: -h/2,
      x: -h/(2*Math.tan(angle))
    };
  }
  
  if (angle >= 3*pi/4  && angle < 5*pi/4) {
    return {
      x: -w/2,
      y: (w*Math.tan(angle))/2
    };
  }
  
  if (
    (angle >= 5*pi/4  && angle < 0)
    ||
    (angle >= 0  && angle < 7*pi/4)
  ) {
    return {
      y: h/2,
      x: h/(2*Math.tan(angle))
    };
  }
},

addTooltip: function(svg) {
  svg.append('g').append('rect')
    .attr({
      'id': 'tooltip',
      'width': 100,
      'height': 20
    })
    .style({
      'fill': 'steelblue'
    })
}

  };
}])