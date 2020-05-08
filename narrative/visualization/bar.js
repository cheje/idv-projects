export function bar() {
// constants
  const width = window.innerWidth * 0.4, // 40% of window width
    height = window.innerHeight * 0.4,
    margin = { top: 20, bottom: 10, left: 10, right: 10 },
    paddingInner = 0.1;

  // bar chart
  const svg = d3
    .select("#bar") // in index.html
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let render = (rawData) => {
    let data = rawData
    .sort((b, a) => +a.ideology_num - +b.ideology_num)
    console.log("filtered 2019 data:", data)

    // scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.ideology_num)])
      .range([margin.left, (width - margin.right)-200]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.ideology))
      .range([margin.top, height - margin.bottom])
      .paddingInner(paddingInner);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(data.length);

    // append bars
    const bars = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => xScale(d3.min(data, d => d.ideology_num))+175) ///////
      .attr("y", d => yScale(d.ideology))
      .attr("width", d => (xScale(d.ideology_num)))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#f40552");

    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("text-anchor", "end")
      .attr("x", d => xScale(d.ideology_num)+195)
      .attr("y", d => yScale(d.ideology))
      .attr('dy', yScale.bandwidth() * 0.7) // shift text along y-axis
      .text(d => d.ideology_num)
      .style("fill", "#fff")
      .style("font-size", "0.9em");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left+185}, 0)`)
      .call(yAxis)
      .selectAll("text")
        .attr("class", "axis")
        .style("text-anchor", "end");
  }

  function filterData(rawData) {
    let data = rawData

    let dataYear = d3.nest()
      .key(d => d.year)
      .map(data)

    return dataYear["$2019"]
  }

  d3.csv("../../data/hg_nys_ideologies.csv", d3.autoType)
    //.then(data => { console.log("data loaded:", data); })
    .then(filterData)
    .then(render)
}
