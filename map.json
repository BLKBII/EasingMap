// Code goes here


// Ratio of Obese (BMI >= 30) in U.S. Adults, CDC 2008
var valueById = [NaN,16.86,16.103,7.105,4.303,3.39,3.073,2.896,2.523,2.347,2.34,1.976,1.917,1.647,1.482,1.457,1.439,1.394,1.203,1.01,1,0.985,0.916,0.885,0.879,0.847,0.825,0.727,0.701,0.662,0.644,0.593,0.555,0.509,0.508,0.485,0.475,0.449,0.437,0.427,0.418,0.412,0.383,0.377,0.366,0.362,0.358,0.346,0.314,0.312,0.308,0.289,0.261,0.259,0.255,0.249,0.236,0.235,0.227,0.227,0.211,0.208,0.2,0.165,0.165,0.163,0.152,0.149,0.149,0.147,0.147,0.141,0.141,0.13,0.127,0.122]
;



var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 3;

var projection = d3.geo.mercator()
.translate([width/2,height/2])
.scale([120]);

var radius = d3.scale.sqrt()
    .domain([0, d3.max(valueById)])
    .range([0, 48]);

var force = d3.layout.force()
    .charge(0)
    .gravity(0)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("map.json", function(error, states) {
  var nodes = states.features

      .filter(function(d) { return !isNaN(valueById[+d.id]); })
      .map(function(d) {
        
                var point = projection(d.geometry.coordinates),
            value = valueById[+d.id];
        if (isNaN(value)) fail();
        return {
          x: point[0], y: point[1],
          x0: point[0], y0: point[1],
          r: radius(value),
          name: d.properties.name,
          label: d.properties.label,
          color: d.properties.color,
          value: value
        };
      });

  force
      .nodes(nodes)
      .on("tick", tick)
      .start();

  var node = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
    .style("fill", function(d) { return d.color; })
      .attr("r", function(d) { return d.r; });
  

var textLabels  = svg.selectAll("text")
.data(nodes)
.enter()
.append("text")
.text(function(d) {
 
  return d.label;
})
.attr("font-family", "arial")
.attr("font-size","11px")
.attr("dy", ".35em")
.attr("text-anchor", "middle")
.attr("fill","white");

  function tick(e) {
    node.each(gravity(e.alpha * .1))
        .each(collide(.5))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
       
    textLabels.each(gravity(e.alpha * .1))
        .each(collide(.5))
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  
        
  }




  function gravity(k) {
    return function(d) {
      d.x += (d.x0 - d.x) * k;
      d.y += (d.y0 - d.y) * k;
    };
  }

  function collide(k) {
    var q = d3.geom.quadtree(nodes);
    return function(node) {
      var nr = node.r + padding,
          nx1 = node.x - nr,
          nx2 = node.x + nr,
          ny1 = node.y - nr,
          ny2 = node.y + nr;
      q.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = x * x + y * y,
              r = nr + quad.point.r;
          if (l < r * r) {
            l = ((l = Math.sqrt(l)) - r) / l * k;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
  svg.selectAll("circle")
         .append("title")
      .text(function(d){
        return d.name;
      });
  
});

