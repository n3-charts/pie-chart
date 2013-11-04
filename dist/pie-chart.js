/*! pie-chart - v1.0.0 - 2013-11-04
* https://github.com/n3-charts/pie-chart
* Copyright (c) 2013 n3-charts  Licensed ,  */
angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', '$window', function($utils, $window) {
  var link  = function($scope, element, attrs, ctrl) {
    var svg;
    var dim = $utils.getDefaultMargins();

    var updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    var update = function() {
      $utils
        .updatePaths(svg, $scope.data, dim, $scope.options)
        .updateLegend(svg, $scope.data, dim, $scope.options)
      ;
    };

    var hard_update = function() {
      $utils.clean(element[0]);
      updateDimensions(dim);
      draw(dim);
    };

    var draw = function(dimensions) {
      var data = $scope.data;
      var options = $scope.options;

      if (!data || !options) {
        return;
      }

      options = $utils.sanitizeOptions(options);
      // data = data.concat(); // this avoids calling again the $watchers since
                            // data is changed by the pie layout...


      svg = $utils.bootstrap(element[0], dimensions);

      $utils
        .draw(svg)
        .updatePaths(svg, data, dimensions, options)
        .addLegend(svg)
        .updateLegend(svg, data, dimensions, options)
      ;
    };

    $window.onresize = function() {
      hard_update();
    };

    $scope.$watch('data', function(newValue, oldValue) {
      $utils.addDataForGauge(newValue, $scope.options);

      if (svg) {
        update();
      } else {
        hard_update();
      }
    }, true);
    $scope.$watch('options', hard_update, true);
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
  return {draw: function(svg) {
  svg.append("g")
    .attr({
      "id": "n3-pie-arcs"
    })
  ;

  return this;
},

updatePaths: function(svg, data, dimensions, options) {
  var tools = this.getTools(dimensions, options);
  
  var tween = function(d) {
    var oldAngles = this.__current ? this.__current : {startAngle: d.startAngle, endAngle: d.startAngle};
    var newAngles = {startAngle: d.startAngle, endAngle: d.endAngle};

    var i = d3.interpolate(oldAngles, newAngles);
    
    return function(t) {return tools.arc(i(t)); };
  };
  
  var paths = svg.selectAll("#n3-pie-arcs")
    .selectAll('.arc')
    .data(tools.pie(data), function(d) {return d.data.label;})
  
  paths.enter()
    .append("path")
      .attr({
        "class": "arc",
        "id": function(d, i) {return "arc_" + i;}
      })
      .style({
        "fill": function(d) {return d.data.color;},
        "fill-opacity": 0.8
      })
  ;
  
  paths
    .transition()
      .duration(250)
      .attrTween("d", tween)
      .each("end", function(d) {
        this.__current = {startAngle: d.startAngle, endAngle: d.endAngle};
      })
  ;
  
  paths.exit().remove();
  
  return this;
},

getTools: function(dimensions, options) {
  var outerRadius = this.getRadius(dimensions);
  var innerRadius = Math.max(outerRadius - options.thickness, 0);

  var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pieLayout = d3.layout.pie()
    .value(function(d) { return d.value; });

  if (options.mode === "gauge") {
    pieLayout.sort(null);
  }
  
  return {pie: pieLayout, arc: arc};
},

addDataForGauge: function(data, options) {
  if (!options || options.mode !== "gauge") {
    return;
  }
  
  if (data.length === 1) {
    data.push({value: options.total - data[0].value, color: "white", __isComplement: true});
  } else if (data.length === 2 && data[1].__isComplement === true) {
    data[1].value = options.total - data[0].value;
  }
  
},

addLegend: function(svg) {
  var items = svg.append("g")
    .attr("id", "n3-pie-legend");
  
  return this;
},

updateLegend: function(svg, data, dimensions, options) {
  if (options.mode === "gauge") {
    this.updateGaugeLegend(svg, data, dimensions, options);
  } else {
    this.updateRegularLegend(svg, data, dimensions, options);
  }
  
  return this;
},

updateRegularLegend: function(svg, data, dimensions, options) {
  var legendHalfHeight = data.length*5;
  
  var scale = d3.scale.linear()
    .range([-legendHalfHeight, legendHalfHeight])
    .domain([0, data.length-1])
    .nice()
  
  var that = this;
  var radius = this.getRadius(dimensions);
  var availableWidth = radius - options.thickness*2;
  
  var items = svg.selectAll("#n3-pie-legend")
    .selectAll(".legend-item")
      .data(data, function(d) {return d.label;});
  
  items.enter()
    .append("text")
      .classed("legend-item", true)
      .on("mouseover", this.onMouseOver(svg))
      .on("mouseout", this.onMouseOut(svg))
  
  items
    .text(this.getLegendLabelFunction(availableWidth))
    .attr({
      "text-anchor": "middle",
      "transform": function(d, i) {
        return "translate(0, " + scale(i) + ")";
      }
    })
    .style({
      "font-family": "monospace",
      "fill": function(d) {return d.color;},
      "fill-opacity": 0.8
    });

  items.exit().remove();
},

updateGaugeLegend: function(svg, data, dimensions, options) {
  var availableWidth = this.getRadius(dimensions) - options.thickness*2;
  
  svg.selectAll("#n3-pie-legend > *").remove();
  
  svg.selectAll("#n3-pie-legend")
    .append("text")
    .attr({
      "class": "legend-title",
      "text-anchor": "middle",
      "y": -availableWidth/2 + "px"
    })
    .style({
      "font-size": Math.min(availableWidth/2, 20) + "px",
      "fill": data[0].color,
      "fill-opacity": 0.8
    })
    .text(data[0].label)
    ;
  
  svg.selectAll("#n3-pie-legend")
    .append("text")
    .attr({
      "class": "legend-value",
      "text-anchor": "middle",
      "y": availableWidth/2 + "px" 
    })
    .style({
      "font-size": availableWidth + "px",
      "fill": data[0].color,
      "fill-opacity": 0.8
    })
    .text(data[0].value)
    ;
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

looksLikeSameSeries: function(newData, oldData) {
  if (newData.length !== oldData.length) {
    return false;
  }
  
  for (var i = 0; i < newData.length; i++) {
    if (oldData[i].label !== newData[i].label) {
      return false;
    }
    
    if (oldData[i].color !== newData[i].color) {
      return false;
    }
  }
  
  return true;
},

sanitizeOptions: function(options) {
  if (options.thickness === undefined) {
    options.thickness = 20;
  } else {
    options.thickness = parseInt(options.thickness);
  }
  
  
  if (options.mode === "gauge") {
    this.sanitizeGaugeOptions(options);
  }
  
  return options;
},

sanitizeGaugeOptions: function(options) {
  if (options.total === undefined) {
    options.total = 100;
  } else {
    options.total = parseInt(options.total);
  }
}

  };
}])