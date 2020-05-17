import { USMap } from "./map.js";
import { USstate } from "./state_name.js"; // new
import { Barchart } from "./barchart.js";
import { Table } from "./table.js";

let map, stateName, barchart, table;

// global state

let state = {
  geojson: null, // full dataset
  hg: null, // full dataset
  ideology: null, // full dataset
  domain: [], // value range
  selectedState: null,
};

Promise.all([
  d3.json("../data/usStates.json"),
  d3.csv("../data/hg.csv", d3.autoType),
  d3.csv("../data/hg_ideology_across.csv", d3.autoType),
]).then(([geojson, hg, ideology]) => {
  console.log("ideology", ideology);
  state.geojson = geojson;
  state.hg = hg;
  state.ideology = ideology;
  state.domain = [
    0,
    d3.max(ideology
      .map(d => [d["Anti-Immigrant"], d["Anti-LGBTQ"], d["Anti-Muslim"], d["Black Separatist"], d["Christian Identity"], d["General Hate"],	d["Hate Music"], d["Holocaust Denial"], d["Ku Klux Klan"], d["Male Supremacy"], d["Neo-Confederate"], d["Neo-Nazi"], d["Neo-Volkisch"], d["Racist Skinhead"], d["Radical Traditional Catholicism"], d["White Nationalist"]])
      .flat()
    )]
  init();
});

function init() {
  map = new USMap(state, setGlobalState);
  stateName = new USstate(state, setGlobalState);
  barchart = new Barchart(state, setGlobalState);
  table = new Table(state, setGlobalState);
  draw();
}

function draw() {
  map.draw(state);
  stateName.draw(state, setGlobalState);
  barchart.draw(state, setGlobalState);
  table.draw(state, setGlobalState);
}

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(newState) {
  state = { ...state, ...newState };
  console.log("new state:", state);
  draw();
}
