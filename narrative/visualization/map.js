export function map() {

  // constants
  const width = window.innerWidth * 0.4,
  height = window.innerHeight * 0.6,
  margin = { top: 20, bottom: 10, left: 10, right: 10 };

  let svg;

  Promise.all([
    d3.json("../../data/nys_counties.json"),
    d3.csv("../../data/hg_nys_geocoded.csv")])
    .then(([nys, cities]) => {
    const counties = topojson.feature(nys, nys.objects.cb_2015_new_york_county_20m);
    console.log("nys:", nys);
    console.log("cities:", cities);

    const cityRadius = d3.scaleSqrt()
      .domain([0, d3.max(cities, d => d.city_total)])
      .range([0, 5]);

    const zoom = d3.zoom()
      .scaleExtent([1, 5])
      .on("zoom", zoomed);

    const svg = d3
      .select("#map")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset);

    const g = svg.append("g");

  // https://stackoverflow.com/questions/46327421/why-is-this-topojson-rendered-so-small-with-d3-simple-example
    const projection = d3
      .geoAlbers()
      .center([0,42.7])
      .rotate([73,0])
      .parallels([41,44])
      .scale(5000);

    const path = d3
      .geoPath()
      .projection(projection);

    // tooltips
    d3
      .select("body")
      .append("div")
      .attr("id", "tooltip");

    g
      .selectAll("path")
      .data(counties.features)
      // append path for each element
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", d => path(d))
      //.on("click", clicked)
      .attr("d", path);

    g
      .selectAll("circle")
      .data(cities)
      .join("circle")
      .attr("r", d => cityRadius(d.city_total))
      // .attr("fill", d => {
      //   const pointColor = d3
      //     .scaleLinear()
      //     .domain([d3.min(cities, d => d.city_total), d3.max(cities, d => d.city_total)])
      //     .range(["#fed976", "#e31a1c"]);
      //   return pointColor(d.city_total)}) // https://www.d3-graph-gallery.com/graph/custom_color.html
      .attr("class", "cities")
      .attr("transform", d => {
        const [x, y] = projection([d.lon, d.lat]);
        return `translate(${x}, ${y})`})
      .on("mouseover", d => { d3
        .select("#tooltip")
        .html(`
          <strong>${d.city}, NY
          <br />${d.city_total}</strong> hate group(s)
          <hr style="border-top: 1px;" />
          <span style="font-size:0.85em; color:#c70039;">
          ${d.ideologies}
          </span>
          `)
        .transition()
        .duration(200)
        .style("opacity", 0.8)
      })
      .on("mouseout", d => { d3
        .select("#tooltip")
        .style("opacity", 0)
        })
      .on('mousemove', d => { d3
        .select("#tooltip")
        .style("left", (d3.event.pageX+20)+"px")
        .style("top", (d3.event.pageY+20)+"px")
      });


    svg.call(zoom);

  // zoom to bounding box tutorial:
  // https://observablehq.com/@d3/zoom-to-bounding-box
    function reset() {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }

    function clicked(d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      d3.event.stopPropagation();
      svg.transition().duration(250).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.mouse(svg.node())
      );
    }

    function zoomed() {
      const {transform} = d3.event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    return svg.node();

  });
}
