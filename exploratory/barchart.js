class Barchart {

    constructor(state, setGlobalState) { // static
      this.width = window.innerWidth * 0.5;
      this.height = window.innerHeight * 0.7;
      this.margin = { top:20, bottom:10, left:5, right:0 };
      this.duration = 500;

      this.svg = d3
        .select("#barchart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      }

    draw(state, setGlobalState) { // dynamic

      const filteredIdeologyData = state.ideology.find(d => state.selectedState === d.state);

      const metrics = ["Anti-Immigrant", "Anti-LGBTQ", "Anti-Muslim", "Black Separatist", "Christian Identity", "General Hate", "Hate Music", "Holocaust Denial", "Ku Klux Klan", "Male Supremacy", "Neo-Confederate", "Neo-Nazi", "Neo-Volkisch", "Racist Skinhead", "Radical Traditional Catholicism", "White Nationalist"];
      //console.log(metrics);
      const metricData = metrics.map(metric => {
        return {
          state: state.selectedState,
          metric: metric,
          value: filteredIdeologyData ? filteredIdeologyData[metric] : 0,
        };
      });

      const xScale = d3 // number of groups by ideology
        .scaleLinear()
        .domain([0, d3.max(state.domain)])
        .range([this.margin.left, this.width - this.margin.right])

      const yScale = d3 // ideologies
        .scaleBand()
        .domain(metrics)
        .range([0, 25 * metrics.length])
        .paddingInner(0.1);

        console.log(metrics);
        console.log(yScale('Neo-Nazi'));
        console.log(yScale.bandwidth()); // width of the bands

      const yAxis = d3
        .axisLeft(yScale)
        //.ticks(metricData.length);

      // https://github.com/d3/d3-scale-chromatic
      const barColor = d3
        .scaleLinear()
        .domain(state.domain)
        .range(["#fed976", "#f03b20"]);

      const bars = this.svg
        .text(`${state.selectedState}`)
        .selectAll("g.bar")
        .data(metricData)
        .join(
          enter =>
            enter
              .append("g")
              .attr("class", "bar")
              //.attr("width", "100%")
              .call(enter => enter.append("rect")),
          update => update,
          exit => exit.remove());

      bars
        .selectAll("rect")
        .transition()
        .duration(this.duration)
        .attr("x", d => xScale(d3.min(metricData, d => d.value)))
        .attr("y", d => yScale(d.metric))
        .attr("width", d => (d.value * 7))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => barColor(d.value))
        //.style("fill-opacity", 0.8);

      const text = this.svg
        .selectAll("text")
        .data(metricData)
        .join("text")
          .attr("fill", d => barColor(d.value))
          .attr("x", d => (d.value * 7)) // proportional nudging
          .attr("y", d => yScale(d.metric) + (yScale.bandwidth() / 2))
        .html(d => `${d.value} | ${d.metric}`)
          //.attr("text-anchor", "end")
          .style("font-size", "1em")
          .attr("dx", "0.6em") // straight nudging
          .attr("dy", "0.4em") // value placement to bar height


      // y-axis
      this.svg
        .append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${this.margin.left}, 0)`)
        .selectAll("text")
          .style("text-anchor", "end");
    }
  }

export { Barchart };
