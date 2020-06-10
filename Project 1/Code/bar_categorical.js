// For Categorical Data drawing the bar charts

function drawBar(data, attributeName) {
    document.getElementById("note").style.visibility = "hidden";
    numerical = false;
    let mapD = {};
    // Mapping the data (String-> count of that Categorical Variable)
    for (let i = 0; i < data.length; i++) {
        let city = data[i];
        if (!mapD[city]) {
            mapD[city] = 1;
        } else {
            mapD[city]++;
        }
    }
    // Setting the Width and height of the SVG the graph area
    let svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    let g = svg.append("g")
        .attr("transform", "translate(" + 90 + "," + 90 + ")");

    // Adding scales on both the Axis for out shooting graphs bar
    let y = d3.scaleLinear()
        .domain([0, d3.max(d3.keys(mapD), d => mapD[d])])
        .range([height, 0]);
    let x = d3.scaleBand() // Cannot be linear for the X-axis. It depends on the ranges.
        .domain(d3.keys(mapD))
        .range([0, width]) // Value to be mapped to.
        .paddingInner(0.2) // Gaps in between graph bars and the outer.
        .paddingOuter(0.2);

    // Now creating the Axes
    const xAxisgroup = g.append('g')
        .attr("transform", "translate(0," + height + ")");      // const yAxisgroup = g.append('g');

    g.selectAll(".bar")
        .data(d3.keys(mapD))  // load data
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", x.bandwidth)
        .attr("height", d => height - y(mapD[d]))
        .attr("x", d => x(d))
        .attr("y", d => y(mapD[d]))
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut);

    function onMouseOver(d) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', x.bandwidth() + 20)
            .attr("height", function () {
                return height - y(mapD[d]) + 20;
            })
            .attr("y", function () {
                return y(mapD[d]) - 20;
            })
            .attr("x", d => x(d) - 10);
        g.append("text")
            .attr('class', 'val')
            .attr('x', x(d) + 25)
            .attr('y', y(mapD[d]) - 25)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .text(function () {
                return mapD[d];
            });
    }

    function onMouseOut(d) {
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', x.bandwidth())
            .attr("y", function () {
                return y(mapD[d]);
            })
            .attr("height", function () {
                return height - y(mapD[d]);
            })
            .attr("x", x(d));
        d3.selectAll('.val')
            .remove()
    }

    // Create and Call the axes
    const xAxis = d3.axisBottom(x);// Pass x which contains info for all x width and names etc.
    // const yAxis = d3.axisLeft(y).ticks(7);

    xAxisgroup.call(xAxis);
    xAxisgroup.selectAll('text')
        .attr("transform", "rotate(-30)")
        .attr("text-anchor", "end")
        .attr("font-size", "15px");         // yAxisgroup.call(yAxis);

    // Creating the Axes Overall Labelling
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("y", height - 450)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text(attributeName);
    // For Y-axis ticks and Labelling
    g.append("g")
        .call(d3.axisLeft(y).ticks(7))
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
}