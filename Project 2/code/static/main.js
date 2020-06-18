// Function to get the desired data depending upon the dropdown selection
function get_data(value)
{
  if(value == 'task2a')
  {
    get_map_scree('/noSamplingScree',"Scree Plot for No Sampling")
    
  }
  else if(value == 'task2b')
  {
    get_map_scree('/randomSamplingScree',"Scree Plot for Random Sampling")
    
  }
  else if(value == 'task2c')
  {
    get_map_scree('/stratifiedSamplingScree',"Scree Plot for Stratified Sampling")
    
  }
  else if(value == 'task3a1')
  {
    get_map_scatterplot('/originalScatterPlot','PCA Scatter plot for Original Data')
  }
  else if(value == 'task3a2')
  {
    get_map_scatterplot('/randomSamplingScatterPlot','PCA Scatter plot for Random Sampling')
  }
  else if(value == 'task3a3')
  {
    get_map_scatterplot('/stratifiedSamplingScatterPlot','PCA Scatter plot for Stratified Sampling')
  }
  else if(value == 'task3b1')
  {
    get_map_scatterplot('/originalMDSEuclidean','MDS Euclidean Scatter plot for Original Data')
  }
  else if(value == 'task3b2')
  {
    get_map_scatterplot('/randomSamplingMDSEuclidean','MDS Euclidean Scatter plot for Random Sampling')
  }
  else if(value == 'task3b3')
  {
    get_map_scatterplot('/stratifiedSamplingMDSEuclidean','MDS Euclidean Scatter plot for Stratified Sampling')
  }
  else if(value == 'task3c1')
  {
    get_map_scatterplot('/originalMDSCorrelation','MDS Correlation Scatter plot for Original Data')
  }
  else if(value == 'task3c2')
  {
    get_map_scatterplot('/randomSamplingMDSCorrelation','MDS Correlation Scatter plot for Random Sampling')
  }
  else if(value == 'task3c3')
  {
    get_map_scatterplot('/stratifiedSamplingMDSCorrelation','MDS Correlation Scatter plot for Stratified Sampling')
  }
  else if(value == 'task3d1')
  {
    get_map_scatterMatrix('/originalMatrix','Scatterplot Matrix for Original Data')
  }
  else if(value == 'task3d2')
  {
    get_map_scatterMatrix('/randomSamplingMatrix','Scatterplot Matrix for Random Sampling')
  }
  else if(value == 'task3d3')
  {
    get_map_scatterMatrix('/stratifiedSamplingMatrix','Scatterplot Matrix for Stratified Sampling')
  }

}
// Function for AJAX request to server Flash, to get the data to Visualise
function get_map_scree(url,title) {
  $.ajax({
    type: 'GET',
    url: url,
    contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {
    },
    success: function(result) {
        screePlot(result["cumSum"],result["eigen"],title)
    }
    }
  );
}
// Function for AJAX request to server Flash, to get the data to Visualise
function get_map_scatterplot(url,title) {
  $.ajax({
    type: 'GET',
    url: url,
    contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {
    },
    success: function(result) {
        scatterPlot(result["scatterData"],title)
    }
    }
  );
}
// Function for AJAX request to server Flash, to get the data to Visualise
function get_map_scatterMatrix(url,title) {
  $.ajax({
    type: 'GET',
    url: url,
    contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {
    },
    success: function(result) {
        scatterPlotMatrix(result["scatterData"],result["names"], title)
    }
    }
  );
}

function scatterPlotMatrix(data,names,title)
{
  // This function is used to plot the scatterPlotMatrix. Refered Template code from https://bl.ocks.org/
  var nameIndex = 0;
  d3.select("#chart").remove()
  var width = 1200,
      size = 240,
      padding = 20;

  // Define Scales
  var x = d3.scale.linear().range([padding / 2, size - padding / 2]);
  var y = d3.scale.linear().range([size - padding / 2, padding / 2]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);
  var color = d3.scale.category10();
  var dataNew = {}
  
  // Get data in desired format
  var domainByTrait = {},
      traits = [0,1,2],
      n = traits.length;

  traits.forEach(function(trait) { domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; }); });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  //Create SVG element to show visualization
  var svg = d3.select("body").append("svg")
      .attr("id", "chart")
      .attr("class","svgContainer")
      .attr("width", size * n + padding + 10)
      .attr("height", size * n + padding + 15)
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
  svg.append("text")
      .attr("x", (width / 3))
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("text-decoration", "underline")
      .style("font-weight", "bold")
      .text(title);
  // Label Axis
  svg.selectAll(".x.axis")
      .data(traits)
      .enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
  // Label Axis
  svg.selectAll(".y.axis")
      .data(traits)
      .enter()
      .append("g")
      .attr("class", "y axis")
      .attr("transform", (d, i) => "translate(0," + i * size + ")")
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
  // Plot individual Cells of the scatter plot matrix
  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .style('fill', 'red')
      .text(function(){ nameIndex = nameIndex + 1; return names[nameIndex-1]});

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);
    // Cells boundaries rectangles
    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding)
        .attr("fill", "none");
    // ScatterPlots
    cell.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 4)
        .style("fill", "darkgreen");
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

}

function scatterPlot(data,title)
{
    d3.select('#chart').remove();
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;
    var x = d3.scale.linear().domain([d3.min(data,d => d[0]),d3.max(data, d=>d[0])]).range([0,width]);
    var y = d3.scale.linear().domain([d3.min(data,d => d[1]),d3.max(data, d=>d[1])]).range([height, 0]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");
    var color = d3.scale.category10();

    var svg = d3.select("body").append("svg")
          .attr("id", "chart")
          .attr("class","svgContainer")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Plot scatter dots
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d,i) => x(d[0]))
        .attr("cy", (d,i) => y(d[1]))
        .attr("r", 3)
        .attr("fill","red")
    
    // Draw x-axis
    svg.append("g")
          .attr("class", "axiss")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
    
    // Draw y-axis
    svg.append("g")
          .attr("class", "axiss")
          .attr("transform", "translate(,0)")
          .call(yAxis);
    // y-axis label
    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "end")
        .style("font-size","14px")
        .attr("transform", "translate("+ -40 +"," + (height/2) + ")rotate(-90)")
        .text("PCA 1");
    // x-axis label
    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "end")
        .style("font-size","14px")
        .attr("transform", "translate("+ (width/2) +"," + (height+50) + ")")
        .text("PCA 2");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text(title);
}

function screePlot(data_cum,data_eigen,title)
{
    d3.select('#chart').remove();
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
    
    var x = d3.scale.ordinal().domain(data_cum.map(function(d,i){return i+1;})).rangeRoundBands([0, width],.1);
    var y = d3.scale.linear().domain([0, d3.max(data_cum)]).range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var markerX
    var markerY

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .x(function(d,i) {
            if (i == 2) {
                markerX = x(i+1)+20;
                markerY = y(d)
            }
            return x(i+1)+20;
        })
        .y(function(d) { return y(d); })

    // Add an SVG element with the desired dimensions and margin.
    var svg = d3.select("body").append("svg")
          .attr("id", "chart")
          .attr("class","svgContainer")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create Bars
    svg.selectAll('rect')
          .data(data_eigen)
          .enter()
          .append('rect')
          .attr('x', (d,i) => x(i+1))
          .attr('y', d => y(d))
          .attr('width', (width / data_cum.length) - 5)
          .attr('height', d => height - y(d))
          .attr('fill', 'green');

    //Create Line Path
    svg.append("path")
        .attr("class", "line")
        .attr("d", line(data_cum))
        .attr("transform", "translate(0,0)")
        .attr("fill","none")
        .attr("stroke","red")
        .attr("stroke-width","2px");
    // Create circle dots on line
    svg.selectAll("circle")
        .data(data_cum)
        .enter()
        .append("circle")
        .attr("cx", (d,i) => x(i+1)+20)
        .attr("cy", d => y(d))
        .attr("r", 4)
        .attr("transform", "translate(0,0)")
        .attr("fill","red")
        .on("mouseover",handleMouseOver)
        .on("mouseout", handleMouseOut)

    function handleMouseOver(d, i) {  // Add interactivity
          // Use D3 to select element, change color and size
          d3.select(this)
            .attr("fill","green")
            .attr("r",6);
          var formatDecimal = d3.format(".3f");
          // Specify where to put label of text
          svg.append("text")
             .attr("id","t")
             .attr("x",x(i+1))
             .attr("y", y(d)-15)
             .text(formatDecimal(d));
    }

    function handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this)
          .attr("fill","red")
          .attr("r",4)
        // Select text by id and then remove
        d3.select("#t").remove();  // Remove text location
      }
    // Show Significant Line
    var h_line = svg.append("line")
        .attr("x1", 0)
        .attr("y1", y(0.75))
        .attr("x2", x(3)+(width/data_cum.length)/2)
        .attr("y2", y(0.75))
        .attr("stroke-width", 1)
        .attr("stroke", "blue")
    var v_line = svg.append("line")
        .attr("x1", x(3)+(width/data_cum.length)/2)//markerX)
        .attr("y1", y(0.75))
        .attr("x2", x(3)+(width/data_cum.length)/2)
        .attr("y2", height)
        .attr("stroke-width", 1)
        .attr("stroke", "blue")

    // Draw x-axis
    svg.append("g")
          .attr("class", "axiss")
          .attr("transform", "translate(0," + (height+1) + ")")
          .call(xAxis);

    // Draw Y-axis
    svg.append("g")
          .attr("class", "axiss")
          .attr("transform", "translate(0,0)")
          .call(yAxis);

    // y-axis label
    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ -40 +","+(height/2)+")rotate(-90)")
        .text("Eigen Values");
    // x-axis label
    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height+50)+")")
        .text("PC Axis Number");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text(title);
}
