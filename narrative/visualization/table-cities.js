export function tableCities() {
  // constants
  const width = window.innerWidth * 0.3, // 40% of window width
    height = window.innerHeight * 0.4,
    margin = { top: 20, bottom: 10, left: 10, right: 10 },
    paddingInner = 0.1;

  const columns = ["City", "Ideologies (No. of Groups)", "Total Groups"];

  const table = d3
    .select("#table-cities")
    .append("table")
    .attr("width", width)
    .attr("height", height);


  let render = (rawData) => {
    let data = rawData
    .sort((b, a) => a.city - b.city)
    .map(d => ({
      "City": d.city,
      "Ideologies": d.ideologies,
      "Total Groups": d.city_total
    }))

    table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(columns)
      .join("th")
      .text(d => d) // column names to appear
      .attr("class", "columns")

    const rows = table
      .append("tbody")
      .selectAll("tr")
      .data(data)
      .join("tr");

    rows
      .selectAll("td")
      .data(d => Object.values(d))
      .join("td")
      .html(d => d);
  }

  d3.csv("../../data/hg_nys_geocoded.csv", d3.autoType)
    .then(render)
}
