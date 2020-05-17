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
  // this will be run *one time* when the data finishes loading in
  function init() {
    // + SCALES
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
    const leftBush = xScale(new Date("2000"));
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
      // `this` === the selectElement
      // this.value holds the dropdown value a user just selected
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

    // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)

    // + CREATE SVG ELEMENT
    svg = d3
      .select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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


    // + CALL AXES
    // add the xAxis
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

    // + UPDATE SCALE(S), if needed
    //yScale.domain([0, d3.max(filteredData, d => d.num)]);

    // + UPDATE AXIS/AXES, if needed
    // d3.select("g.y-axis")
    //   .transition()
    //   .duration(1000)
    //   .call(yAxis.scale(yScale)); // this updates the yAxis' scale to be our newly updated one

    // area function generator
    // const areaFunc = d3
    //    .area()
    //    .defined(d => d.num > 0)
    //    .curve(d3.curveLinear)
    //    .x(d => xScale(d.year))
    //    .y1(d => yScale(d.num))
    //    .y0(yScale(0));

    // we define our line function generator telling it how to access the x,y values for each point
    // line chart checklist: https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
    // curves: http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8
    const lineFunc = d3
      .line()
      .defined(d => d.num > 0)
      .x(d => xScale(d.year))
      .y(d => yScale(d.num))
      .curve(d3.curveLinear);

    // + DRAW LINE AND AREA

    // const area = svg
    //   .selectAll("path.area")
    //   .data([filteredData])
    //   .join(
    //     enter =>
    //       enter
    //         .append("path")
    //         .attr("class", "area")
    //         .attr("opacity", 0), // start them off as opacity 0 and fade them in
    //     update => update,
    //     exit => exit.remove()
    //   )
    //   .call(selection =>
    //     selection
    //       .transition() // sets the transition on the 'Enter' + 'Update' selections together.
    //       .duration(1000)
    //       .attr("opacity", 1)
    //       .attr("d", d => areaFunc(d))
    //   );

    const line = svg
      .selectAll("path.trend")
      .data([filteredData])
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "trend")
            .attr("opacity", 0), // start them off as opacity 0 and fade them in
        update => update, // pass through the update selection
        exit => exit.remove()
      )
      .call(selection =>
        selection
          .transition() // sets the transition on the 'Enter' + 'Update' selections together.
          .duration(1000)
          .attr("opacity", 1)
          .attr("d", d => lineFunc(d))
      );

    // // draw circles
    // const dot = svg
    //   .selectAll(".dot")
    //   .data(filteredData, d => d.year) // use `d.year` as the `key` to match between HTML and data elements
    //   .join(
    //     enter =>
    //       // enter selections -- all data elements that don't have a `.dot` element attached to them yet
    //       enter
    //         .append("circle")
    //         .attr("class", "dot") // Note: this is important so we can identify it in future updates
    //         .attr("r", radius)
    //         .attr("cy", height - margin.bottom) // initial value - to be transitioned
    //         .attr("cx", d => xScale(d.year)),
    //     update => update,
    //     exit =>
    //       exit.call(exit =>
    //         // exit selections -- all the `.dot` element that no longer match to HTML elements
    //         exit
    //           .transition()
    //           //.delay(d => d.year)
    //           .duration(500)
    //           .attr("cy", height - margin.bottom)
    //           .remove()
    //       )
    //   )
    //   // the '.join()' function leaves us with the 'Enter' + 'Update' selections together.
    //   // Now we just need move them to the right place
    //   .call(
    //     selection =>
    //       selection
    //         .transition() // initialize transition
    //         .duration(1000) // duration 1000ms / 1s
    //         .attr("cy", d => yScale(d.number)) // started from the bottom, now we're here
    //   );
    }
}
