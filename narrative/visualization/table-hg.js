export function tableHG() {

  // constants
  const width = window.innerWidth * 0.35, // 40% of window width
    height = window.innerHeight * 0.4,
    margin = { top: 20, bottom: 10, left: 10, right: 10 },
    paddingInner = 0.1;

  const columns = ["Group", "Ideology", "City"];

  const table = d3
    .select("#table-hg")
    .append("table")
    .attr("width", width)
    .attr("height", height);

  let render = (rawData) => {
    let data = rawData
    .sort((b, a) => a.city - b.city)
    .map(d => ({
      "Hate Group": d.group,
      "Ideology": d.ideology,
      "City": d.city
    }))

  //const tableNYSData = data
  console.log("filtered NYS data:", data)

    table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(columns)
      .join("th")
      .text(d => d) // column names to appear
      .attr("class", "columns");

    const rows = table
      .append("tbody")
      .selectAll("tr")
      .data(data)
      .join("tr");

    rows
      .selectAll("td")
      .data(d => Object.values(d))
      .join("td")
      .text(d => d);

  }

  function filterData(rawData) {
    let data = rawData

    let dataNYS = d3.nest()
      .key(d => d.state)
      .map(data)

    return dataNYS["$New York"]


  }

  d3.csv("../../data/hg.csv", d3.autoType)
    //.then(data => { console.log("data loaded:", data); })
    .then(filterData)
    .then(render)
}
