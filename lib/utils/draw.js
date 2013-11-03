draw: function(svg, data, dimensions, options) {
  var outerRadius = this.getRadius(dimensions);
  var innerRadius = Math.max(outerRadius - options.thickness, 0);

  var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pie = d3.layout.pie()
    .value(function(d) { return d.value; });


  var g = svg.append("g")
    .attr({
      "id": "n3-pie-arcs"
    })
    .selectAll(".arc")
    .data(pie(data))
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
      "fill": function(d) {return d.data.color;},
      "fill-opacity": 0.8
    });
  
  return this;
}