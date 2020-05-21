export function bar() {

// Mike Bostock: https://observablehq.com/@d3/grouped-bar-chart

  const width = window.innerWidth * 0.65,
    height = window.innerHeight * 0.6,
    margin = { top: 20, bottom: 175, left: 50, right: 10 },
    paddingInner = 0.1;

    d3.csv("../data/hg_ideology_pct_2019.csv", d3.autoType).then(data => {
      console.log("raw data:", data);

    const keys = data.columns.slice(1)
    const groupKey = data.columns[0]

    console.log("keys:", keys[0])
    console.log("groupKey:", groupKey)

    const x0scale = d3.scaleBand()
      .domain(data.map(d => d[groupKey]))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.35)

    const x1scale = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0scale.bandwidth()])
      .padding(0)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
      .rangeRound([height - margin.bottom, margin.top]);

    function make_y_gridlines() {
      return d3
        .axisLeft(yScale)
        .ticks(10)
      }

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0scale).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

    const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))

    const color = d3
    .scaleOrdinal()
    .range(["#3282b8", "#C70039"])


    const legend = svg => {
      const g = svg
        .attr("transform", `translate(${width},0)`)
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .join("g")
          .attr("transform", (d, i) => `translate(0,${i * 20})`);

      g.append("rect")
        .attr("x", -30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color);

      g.append("text")
        .attr("x", -35)
        .attr("y", 9.5)
        .attr("dy", "0.35em")
        .text(d => d)
        .attr("class", "legend");
      }

    // append bars

    const svg = d3
      .select("#bar") // in index.html
      .append("svg")
      .attr("width", width)
      .attr("height", height);

      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));


            var maxValue = d3.max([  // Find the max value of a list of 2 elements
    d3.max(data, function(d) { return +d['New York']; })
]);

    const bars = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(${x0scale(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .join("rect")
        .attr("x", d => x1scale(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", x1scale.bandwidth())
        //.attr("id", function(d, i) {return 'bar_' + i})
        .attr("height", d => yScale(0) - yScale(d.value))
        .attr("fill", d => color(d.key))
        //.style("opacity", 0.7)
        .attr("opacity", function(d) {

          if (d.value === maxValue) {
                  return 1
              } else {
                  return 0.5
              }
          })

    svg.append("g")
        .call(xAxis)
        //.attr("class", "x-axis")
        .selectAll("text")
        .style("text-anchor", "end") // https://stackoverflow.com/questions/20947488/d3-grouped-bar-chart-how-to-rotate-the-text-of-x-axis-ticks
        .attr("dx", "-.8em")
        .attr("dy", ".1em")
        .attr("transform", "rotate(-60)");

    svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "yAxis-label")
        .attr("y", "35%")
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl") // https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
        .text("Percentage of Hate Groups");

    svg.append("g")
        .call(legend)
        .style("opacity", 0.9);

    return svg.node();

  });
}
