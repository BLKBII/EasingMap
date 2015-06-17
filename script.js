// Code goes here



var valueById = [NaN,16.86,16.103,7.105,4.303,3.39,3.073,2.896,2.523,2.347,2.34,1.976,1.917,1.647,1.482,1.457,1.439,1.394,1.203,1.01,1,0.985,0.916,0.885,0.879,0.847,0.825,0.727,0.701,0.662,0.644,0.593,0.555,0.509,0.508,0.485,0.475,0.449,0.437,0.427,0.418,0.412,0.383,0.377,0.366,0.362,0.358,0.346,0.314,0.312,0.308,0.289,0.261,0.259,0.255,0.249,0.236,0.235,0.227,0.227,0.211,0.208,0.2,0.165,0.165,0.163,0.152,0.149,0.149,0.147,0.147,0.141,0.141,0.13,0.127,0.122]
;
var valueByIdDollar = [15.16,24.51,3.12,5.69,4.62,1.59,2.57,1.21,3.86,3.34,1.67,2.49,1.94,0.88,2.18,1.66,1.02,0.53,1.69,0.71,0.70,0.52,0.66,0.00,0.76,0.00,1.01,0.44,0.42,0.44,0.45,0.49,0.28,0.25,0.28,0.24,0.23,0.63,0.93,0.40,0.66,0.27,0.34,0.42,0.26,0.51,0.26,0.12,0.57,0.27,0.24,0.28,0.18,0.27,0.41,0.14,0.09,0.17,0.40,0.30,0.11,0.32,0.14,0.14,0.09,0.09,0.08,0.08,0.10,0.26,0.08,0.12,0.09,0.09,0.07];
var valueByIdPPP = [16.86,16.103,7.105,4.303,3.39,3.073,2.896,2.523,2.347,2.34,1.976,1.917,1.647,1.482,1.457,1.439,1.394,1.203,1.01,1,0.985,0.916,0.885,0.879,0.847,0.825,0.727,0.701,0.662,0.644,0.593,0.555,0.509,0.508,0.485,0.475,0.449,0.437,0.427,0.418,0.412,0.383,0.377,0.366,0.362,0.358,0.346,0.314,0.312,0.308,0.289,0.261,0.259,0.255,0.249,0.236,0.235,0.227,0.227,0.211,0.208,0.2,0.165,0.165,0.163,0.152,0.149,0.149,0.147,0.147,0.141,0.141,0.13,0.127,0.122];
var valueByIdPopulation = [19.12,4.47,17.75,1.76,1.13,2.00,2.84,3.55,0.90,0.89,1.68,0.84,0.70,0.44,0.50,0.65,1.08,1.10,0.33,0.33,2.49,0.96,0.53,1.23,0.59,2.64,0.24,0.43,1.41,0.76,0.67,0.13,2.22,0.55,1.27,0.51,0.43,0.16,0.11,0.08,0.14,0.25,0.25,0.10,0.28,0.12,0.44,0.59,0.07,0.03,0.15,0.15,0.06,0.14,0.12,0.47,0.72,0.14,0.08,0.06,0.29,0.08,0.35,0.23,0.43,0.06,0.13,0.13,0.53,0.06,1.29,0.08,0.15,0.61,0.68];
var nodes;

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
    node.each(gravity(e.alpha * 0.5))
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
      

    $("#Dollar").click(function() {
                   $(".hbutton").removeClass( 'selected' );
                $(this).addClass( 'selected' );
 
$.each(nodes, function(i,v) {
  this.value = valueByIdDollar[i];
this.r = radius(this.value);
});

 force
      .nodes(nodes)
          .friction(0.2)
      .on("tick", tick)
      .start();
node
   .data(nodes)
   .transition()
   .duration(1000)
  .attr("r", function(d) { return d.r; });
        
       });
 
   $("#PPP").click(function() {
                   $(".hbutton").removeClass( 'selected' );
                $(this).addClass( 'selected' );
 
$.each(nodes, function(i,v) {
  this.value = valueByIdPPP[i];
this.r = radius(this.value);
});
 force
      .nodes(nodes)
        .friction(0.2)
      .on("tick", tick)
      .start();
node
   .data(nodes)
   .transition()
   .duration(1000)
  .attr("r", function(d) { return d.r; });


          
       });
      
      $("#Population").click(function() {
                   $(".hbutton").removeClass( 'selected' );
                $(this).addClass( 'selected' );
 
$.each(nodes, function(i,v) {
  this.value = valueByIdPopulation[i];
this.r = radius(this.value);
});
 force
      .nodes(nodes)
        .friction(0.2)
      .on("tick", tick)
      .start();
node
   .data(nodes)
   .transition()
   .duration(1000)
  .attr("r", function(d) { return d.r; });


          
       }); 
      
  
});


  
