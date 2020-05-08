class Table {

  constructor(state, setGlobalState) {
    // this.width = window.innerWidth * 0.2;
    // this.margins = {top: 20, bottom:20, left:20, right:20};

    const columns = ["Group", "Ideology", "City"];

    this.table = d3
      .select("#table")
      .append("table")

    this.table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(columns)
      .join("th")
      .text(d => d) // column names to appear
      .attr("class", "columns")

    this.tableRows = this.table
      .append("tbody")
  }

  draw(state, setGlobalState) {

    const stateData = state.hg.filter(d => state.selectedState === d.state)

    const tableStateData = stateData.map(d => ({
      "Hate Group": d.group,
      "Ideology": d.ideology,
      "City": d.city
    }))
      console.log(stateData);
      console.log(tableStateData);

    this.tableRows
      //.append("tbody")
      .selectAll("tr")
      .data(tableStateData)
      .join("tr")
      .selectAll("td")
      .data(d => Object.values(d))
      .join("td")
      .text(d => d)
      .attr("class", "hate-groups");
      // .join(
      //   enter =>
      //     enter
      //       .append("td")
      //       .attr("class", "hate-groups")
      //       .text(d => d),
      //     update => update,
      //     exit => exit.remove())
  }
}

export { Table };
