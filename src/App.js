import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import MainActivity from "./components/MainActivity";

import { Typography } from "@material-ui/core";
import BluetoothLE from "./helpers/BluetoothLE";

class App extends Component {
  state = {
    start: false
  };

  showHomePage = () => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={_ => {
          this.setState({ start: true });
        }}
      >
        Start
      </Button>
    );
  };

  render() {
    return this.state.start ? <MainActivity /> : this.showHomePage();
  }
}

export default App;
