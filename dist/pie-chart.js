/*! pie-chart - v1.0.0 - 2013-11-02
* https://github.com/n3-charts/pie-chart
* Copyright (c) 2013 n3-charts  Licensed ,  */
angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', '$window', function($utils, $window) {
  var link  = function($scope, element, attrs, ctrl) {
    var dim = $utils.getDefaultMargins();

    var updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    var update = function() {
      $utils.clean(element[0]);
      updateDimensions(dim);
      redraw(dim);
    };

    var redraw = function(dimensions) {
      var data = $scope.data;
      var options = $scope.options;

      if (!data || !options) {
        return;
      }

      options = $utils.sanitizeOptions(options);
      // data = data.concat(); // this avoids calling again the $watchers since
                            // data is changed by the pie layout...

      var svg = $utils.bootstrap(element[0], dimensions);

      $utils
        .draw(svg, data, dimensions, options)
        .addLegend(svg, data, dimensions, options);
    };

    $window.onresize = function() {
      update();
    };

    $scope.$watch('data', update, true);
    $scope.$watch('options', update, true);
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
  return {draw: function(svg, data, dimensions, options) {
  var radius = this.getRadius(dimensions);
  // console.log(radius, options.thickness);

  var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - options.thickness);

  var pie = d3.layout.pie()
    .value(function(d) { return d.value; });


  var g = svg.append("g")
    .attr({
      "id": "n3-pie-arcs"
    })
    .selectAll(".arc")
    .data(pie(data.concat()))
    .enter().append("g")
      .attr({
        "class": "arc",
        "id": function(d, i) {return "arc_" + i;}
      });

  g.append("path")
    .attr({
      "d": arc
    })
    .style({
      // "stroke": "white",
      "fill": function(d) {return d.data.color;},
      "fill-opacity": 0.8
    });
  
  return this;
},

addLegend: function(svg, data, dimensions, options) {
  var yOffset = Math.floor(data.length/2);
  
  var items = svg.append("g")
    .attr({
      "id": "n3-pie-legend"
    })
    .selectAll(".legend-item")
    .data(data.sort(function(a, b) {return b.value - a.value;}))
    .enter().append("g")
      .classed("legend-item", true)
      .style({
        "fill": function(d) {return d.color;},
        "fill-opacity": 0.8,
      })
      .attr({
        "transform": function(d, i) {
          return "translate(0, " + (i - yOffset)*15 + ")";
        }
      })
      .on("mouseover", this.onMouseOver(svg))
      .on("mouseout", this.onMouseOut(svg))
  ;

  var that = this;
  var radius = this.getRadius(dimensions);
  var availableWidth = radius - options.thickness*2;
  
  var text = items.append("text")
    .text(this.getLegendLabelFunction(availableWidth))
    .attr({
      "text-anchor": "middle",
      "x": "0px",
      "y": "15px"
    })
    .style({
      "font-family": "monospace"
    })
},

getLegendLabelFunction: function(availableWidth) {
  var that = this;
  
  return function(datum, index) {
    if (availableWidth < 40) {
      return "";
    } else if (availableWidth < 100) {
      return datum.label;
    }
    
    return that.getLegendLabel(datum.label, datum.value, 20);
  }
},

onMouseOver: function(svg) {
  return function(datum, index) {
    var dimOrHighlight = function(element) {
      return element.transition().duration(50).style({
        "opacity": function(d, i) {
          return i === index ? "1" : "0.4";
        }
      });
    }
    
    dimOrHighlight(svg.selectAll(".legend-item"));
    dimOrHighlight(svg.selectAll(".arc"));
  };
},

onMouseOut: function(svg) {
  return function(datum, index) {
    var show = function(element) {
      return element.transition().duration(50).style({
        "opacity": 1
      });
    }
    
    show(svg.selectAll(".legend-item"));
    show(svg.selectAll(".arc"));
  };
},

getLegendLabel: function(label, value, totalLength) {
  var dots = [];
  for (var i = 0; i < totalLength; i++) {
    dots.push(".");
  }
  
  label = label + " ";
  value = " " + value;
  
  label.split("").forEach(function(c, i) {dots[i] = c;});
  value.split("").forEach(function(c, i) {dots[totalLength - value.length + i] = c;});
  
  return dots.join("");
},

getDefaultMargins: function() {
  return {top: 10, right: 10, bottom: 10, left: 10};
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

sanitizeOptions: function(options) {
  if (options.thickness === undefined) {
    options.thickness = 20;
  }
  
  options.thickness = parseInt(options.thickness);
  
  return options;
}

  };
}])