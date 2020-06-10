// Function for changing the bins with mouse slide
function changeBins() {
    var binCount = 10;
    d3.select("svg").on("mousedown", function () {
        var div = d3.select(this).classed("active", true);
        var xPos = d3.mouse(div.node())[0];
        var w = d3.select(window)
            .on("mousemove", mousemove)
            .on("mouseup", function () {
                if (numerical) {
                    div.classed("active", false);
                    w.on("mousemove", null).on("mouseup", null);
                }
            });
        function mousemove() {
            if (d3.mouse(div.node())[0] + 20 < xPos && binCount < 17) {
                if (numerical) {
                    binCount += 1;
                    document.getElementById("mysvg").innerHTML = "";
                    drawBarChart(activeFeature, binCount, activeAttributeName);
                    xPos = d3.mouse(div.node())[0];
                }
            } else if (d3.mouse(div.node())[0] - 20 > xPos && binCount > 5) {
                if (numerical) {
                    binCount -= 1;
                    document.getElementById("mysvg").innerHTML = "";
                    drawBarChart(activeFeature, binCount, activeAttributeName);
                    xPos = d3.mouse(div.node())[0];
                }
            }
        }
    });
    document.getElementById("mysvg").innerHTML = "";
}
// Function to draw the Histogram for Numerical Continuous Variables
function drawBarChart(data, noOfBins, attributeName) {
    document.getElementById("note").style.visibility = "visible";
    numerical = true;
    // Binning the data into given number of bins. Creating an array to store bin values.
    var binSize = (d3.max(data) - d3.min(data)) / (noOfBins - 1);
    var binValArray = Array.apply(null, Array(noOfBins)).map(Number.prototype.valueOf, 0);
    data.forEach(function (d) {
        binValArray[Math.floor((d - d3.min(data)) / binSize)]++;
    });
    var min = d3.min(data);
    var binValues = [];
    for (var i = 0; i < noOfBins; i++) {
        var end = (+min + +binSize).toFixed(1);
        binValues.push(min + "-" + end);
        min = end;
    }
    // D3 Visualizations
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    // Scalling the x and y axis
    var x = d3.scaleBand()
        .domain(binValues)
        .range([0, width])
        .padding(0.02);
    var y = d3.scaleLinear()
        .domain([0, d3.max(binValArray)])
        .range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 90 + "," + 90 + ")");
    // Creating the x-axis attribute name.
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", height - 450)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text(attributeName);
    // Creating the y-axis attribute name and ticks
    g.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -200)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("Frequency Count");
    // Creating the bars
    g.selectAll(".bar")
        .data(binValues)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", x.bandwidth())
        .attr("height", function (d, i) {
            return height - y(binValArray[i]);
        })
        .attr("x", function (d) {
            return x(d);
        })
        .attr("y", function (d, i) {
            return y(binValArray[i]);
        })
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut);

    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', x.bandwidth() + 10)
            .attr("height", function () {
                return height - y(binValArray[i]) + 20;
            })
            .attr("y", function () {
                return y(binValArray[i]) - 20;
            });

        g.append("text")
            .attr('class', 'val')
            .attr('x', function () {
                return x(d) + 25;
            })
            .attr('y', function () {
                return y(binValArray[i]) - 25;
            })
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .text(function () {
                return [+binValArray[i]];
            });
    }

    function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', x.bandwidth())
            .attr("y", function () {
                return y(binValArray[i]);
            })
            .attr("height", function () {
                return height - y(binValArray[i]);
            });

        d3.selectAll('.val')
            .remove()
    }
}