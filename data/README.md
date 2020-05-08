## Data Sources

The Southern Poverty Law Center has compiled a [database](https://www.splcenter.org/hate-map) of active hate groups in the U.S. since 2010.

**Exploratory**:
- `hg.csv`: The raw data lists each hate group by city (if applicable) and state, along with ideology. For each state, I added the per capita number of groups. (2019)
- `hg_ideology_across.csv`: Number of hate groups by ideology by state. This includes the same groups but in different locations within a state. (2019)
- `usStates.json`: GeoJSON file of the 50 states

**Narrative**:
- `hg.csv` (2019)
- `hg_ideology_pct.csv`: Hate groups by ideology as percent of total number of hate groups in US and in NYS (2019)
- `hg_nys_geocoded.csv`: Cities (geocoded) specified as location of at least one NYS hate group (2019)
- `hg_nys_ideologies.csv`: Number of hate groups by ideology in NYS (2000-2019)
- `nys_counties.json`: TopoJSON file of New York State counties
