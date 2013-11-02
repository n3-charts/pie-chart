draw: function(svg, data, dimensions, options) {
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
}