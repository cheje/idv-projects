export function line() {

  const width = window.innerWidth * 0.65,
    height = window.innerHeight * 0.5,
    margin = { top: 10, bottom: 30, left: 50, right: 10 },
    default_selection = "Select an Ideology";

  // these variables, initially empty, let us access
  // anything we manipulate in init() but need access to in draw()
  let svg;
  let xScale;
  let yScale;
  let yAxis;

  /* APPLICATION STATE */
  let state = {
    data: [],
    selectedIdeology: null, // + YOUR FILTER SELECTION
  };

  d3.csv("../data/hg_nys_ideologies.csv", d => ({
    year: new Date(d.year, 0, 1),
    ideology: d.ideology,
    num: +d.ideology_num,
  })).then(data => {
    console.log("line data:", data);
    state.data = data;
    init();
  });

  /* INITIALIZING FUNCTION */
  // this will be run one time when the data finishes loading
  function init() {

    xScale = d3
      .scaleTime()
      .domain(d3.extent(state.data, d => d.year)) // extent outputs min and max in an array
      .range([margin.left, width - margin.right]);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(state.data, d => d.num)])
      .range([height - margin.bottom, margin.top]);

    function make_y_gridlines() {
      return d3
        .axisLeft(yScale)
        .ticks(10)
      }

    // + AXES
    const xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    // adding presidential terms: https://stackoverflow.com/questions/17797547/d3-how-do-you-highlight-a-range-of-dates-on-d3-a-line-chart
    const leftClinton = xScale(new Date("2000"));
    const rightClinton = xScale(new Date("2001"));
    const rangeClinton = rightClinton - leftClinton;

    const leftBush = xScale(new Date("2001"));
    const rightBush = xScale(new Date("2009"));
    const rangeBush = rightBush - leftBush;

    const leftObama = xScale(new Date("2009"));
    const rightObama = xScale(new Date("2017"));
    const rangeObama = rightObama - leftObama;

    const leftTrump = xScale(new Date("2017"));
    const rightTrump = xScale(new Date("2019"));
    const rangeTrump = rightTrump - leftTrump;

    // + UI ELEMENT SETUP
    const selectElement = d3
      .select("#dropdown")
      .on("change", function() {
        console.log("New selection is", this.value);
        state.selectedIdeology = this.value;
        draw(); // re-draw the graph based on this new selection
      });

    // add in dropdown options from the unique values in the data
    selectElement
      .selectAll("option")
      .data([default_selection,
        ...Array.from(new Set(state.data.map(d => d.ideology))),
      ])
      .join("option")
      .attr("value", d => d)
      .text(d => d);

    // this ensures that the selected value is the same as what we have in state when we initialize the options
    selectElement.property("value", default_selection);

    svg = d3
      .select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Clinton admin
    svg
      .append("rect")
      .attr("x", leftClinton)
      .attr("width", rangeClinton)
      .attr("height", height)
      .attr("class", "dem-range");
    // Bush admin
    svg
      .append("rect")
      .attr("x", leftBush)
      .attr("width", rangeBush)
      .attr("height", height)
      .attr("class", "rep-range");
    // Obama admin
    svg
      .append("rect")
      .attr("x", leftObama)
      .attr("width", rangeObama)
      .attr("height", height)
      .attr("class", "dem-range");
    // Trump admin
    svg
      .append("rect")
      .attr("x", leftTrump)
      .attr("width", rangeTrump)
      .attr("height", height)
      .attr("class", "rep-range");

    // grid lines: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat(""));

    svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", "50%")
      .attr("dy", "3em");
    // add the yAxis
    svg
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "yAxis-label")
      .attr("y", "50%")
      .attr("dx", "-3em")
      .attr("writing-mode", "vertical-rl") // https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
      .text("Number of Hate Groups");

    draw();
  }

  /* DRAW FUNCTION */
  // we call this everytime there is an update to the data/state
  function draw() {
    // + FILTER DATA BASED ON STATE
    let filteredData = [];
    if (state.selectedIdeology !== null) {
      filteredData = state.data.filter(d => d.ideology === state.selectedIdeology);
    }

    const lineFunc = d3
      .line()
      .defined(d => d.num > 0)
      .x(d => xScale(d.year))
      .y(d => yScale(d.num))
      .curve(d3.curveLinear);

    const line = svg
      .selectAll("path.trend")
      .data([filteredData])
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "trend")
            .attr("opacity", 0),
        update => update,
        exit => exit.remove()
      )
      .call(selection =>
        selection
          .transition()
          .duration(1000)
          .attr("opacity", 1)
          .attr("d", d => lineFunc(d))
      );
    }
}
