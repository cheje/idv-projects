class USstate {

  constructor(state, setGlobalState) {
    this.stateName = d3.select("#state-name")
  }

  draw(state, setGlobalState) {
    this.stateName
      .text(`${state.selectedState}`)
    }
  }

export { USstate };
