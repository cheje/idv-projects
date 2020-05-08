class USMap {

    constructor(state, setGlobalState) {
        this.width = window.innerWidth * 0.5;
        this.height = window.innerHeight * 0.7;
        //this.margins = {top: 20, bottom:20, left:20, right:20};
        //this.paddingInner = 0.1;

        const filteredData = state.hg.map(d => ({
          "state": d.state,
          "gpsPerCapita": d.gpsPerCapita
        }));
        console.log(filteredData)

        // https://groups.google.com/forum/#!msg/d3-js/pl297cFtIQk/Eso4q_eBu1IJ
        const uniqueData = d3
          .nest()
          .key(function(d) { return d.state; })
          .entries(filteredData)
          .map(function(entry) { return entry.values[0]; });
        console.log(uniqueData)

        // https://github.com/d3/d3-scale-chromatic
        const colorScale = d3.scaleSequential(d3.interpolateOrRd)
          .domain(d3.extent(uniqueData.map(d => d.gpsPerCapita)))

        const projection = d3
          .geoAlbersUsa()
          .fitSize([this.width, this.height], state.geojson);

        const path = d3
          .geoPath()
          .projection(projection);

        const hgLookup = new Map(uniqueData.map(d => [d.state, d.gpsPerCapita]))

        // tooltip
        d3.select("body")
          .append("div")
          .attr("id", "tooltip");

        // map
        this.svg = d3
          .select("#map")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height);

        this.svg
          .selectAll(".state")
          .data(state.geojson.features)
          .join("path")
          .attr("d", path)
          .attr("class", "state")
          .attr("fill", d => {
            console.log(d)
            const stateName = d.properties.NAME
            const stateHG = hgLookup.get(stateName)
            return colorScale(stateHG)
          })
          .attr("opacity", 0.8)
          .on("mouseover", function(d, i) { d3
            .select(this)
            .attr("opacity", 1)
            })
          .on('mouseover.tooltip', function(d) { d3 // tooltip
            .select('#tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            .text(d.properties.NAME)})
          .on('mouseout.tooltip', function() { d3 // tooltip
            .select('#tooltip')
            .style('opacity', 0)
          })
          .on('mousemove.tooltip', function() { d3 // tooltip
            .select('#tooltip')
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY + 20) + 'px')
          })
          .on("mouseout", function(d, i) { d3
            .select(this)
            .attr("opacity", 0.8)
          })
          .on("click", function(d, i) { d3
            .select(this)
            .join("path");
            setGlobalState({ selectedState: d.properties.NAME });
          });
    }

    draw(state, setGlobalState) {

    }
  }

export { USMap };
