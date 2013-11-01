getDefaultMargins: function() {
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
}