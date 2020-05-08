## Prospectus

For the exploratory project, I was originally going to use data on cetaceans in captivity in the U.S. After running into some challenges with visualizing it in D3, I decided to go with a source I had used for the [time series tutorial](https://cheje.github.io/Interactive-Data-Vis-Sp2020/tutorial4_timeseries/) – the Southern Poverty Law Center, which tracks hate groups across the states. A few weeks after the assignment, the organization [released](https://www.splcenter.org/presscenter/year-hate-2019-white-nationalist-groups-rise-second-year-row-55-2017) the list of hate groups active in 2019. Through this newly-released [data](https://www.splcenter.org/hate-map), I hope to answer, through visualizations, the following questions:

- Which states have the highest per capita number of hate groups?
- How do the type of hate groups differ by state?

Rather than finding numbers on a national level, I will likely keep it at a state level and use the project to compare hate groups between states. The SPLC "identified 940 hate groups operating across the country in 2019, a slight decline from the all-time high of 1,020 in 2018" but at the time same time, the number of white nationalist and anti-LGBTQ groups increased from 2018. The intended audience of this project would be those concerned by this atmosphere of sustained and growing organized hatred, regardless of their familiarity with the subject matter.

The data lists all active hate groups' tracked in 2019 along with their location, ideology and other details. I hope to have a chart or two that present aggregated numbers, including:

- Number of groups by states
- Per capita number of groups by state
- Number of groups by ideology per state

I'll use R to shape the data for this.

## Sketch

<img src="https://github.com/cheje/idv-exploratory/raw/master/prospectus-sketches/sketch.png" width="400">

As shown in the sketch, I initially narrowed down the chart types to bar, table, treemap, map and line. But after deciding to use just the data from 2019, I think I will focus on making a bar chart, table and map or treemap. I am leaning toward a map since this is about the 50 states and it would be visually different from a treemap which would continue the "boxy" appearance of a bar chart and table. The map and bar chart would likely plot the aggregated data.

## Mockup

<img src="https://github.com/cheje/idv-exploratory/raw/master/prospectus-sketches/mockup.png" width="600">

1. **Map**

- Interactions expected by user: tooltip when hovering over state that lists state and number of hate groups, per capita number
- Interactions to enhance experience: click on state to reveal more information via adjacent visuals
- Context: gives geographic overview of hate groups across the country using color to visualize which states have most hate groups per capita

2. **Bar chart**

- Context: aggregated overview of groups organized by ideology (bit easier to digest than a straight-up list of all the groups)
- Interactions: list will appear from clicking a state so no further manipulation of the data would be done

3. **Table**

- Context: while other visualizations will be aggregations, the table will display the SPLC data as it originally appeared – list of all the hate groups along with their ideology and location
- Interactions: no further interaction beyond table of groups appearing once state is clicked on, maybe way to sort columns alphabetically?

## Architecture

<img src="https://github.com/cheje/idv-exploratory/raw/master/prospectus-sketches/architecture.png" width="400">

## [Data](../data)

- Per capita number of hate groups by state (CSV) » map
- Map of 50 states (GeoJSON)
- Number of hate groups by ideology per state (CSV) » bar chart
- List of individual hate groups (CSV) » table
