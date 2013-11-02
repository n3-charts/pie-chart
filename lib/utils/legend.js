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