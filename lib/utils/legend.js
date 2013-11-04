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
        "opacity": function(d, i) {return i === index ? "1" : "0.4";}
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
}