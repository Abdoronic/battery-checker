import React, { Component } from "react";
import MainActivity from "./components/MainActivity";
import Icon from "./Assets/BatteryIcon.png";

import { Typography } from "@material-ui/core";
import BluetoothLE from "./helpers/BluetoothLE";

class App extends Component {
  state = {
    start: false
  };

  showHomePage = () => {
    return (
      <div
        style={styles.homepage}
        onClick={_ => {
          this.setState({ start: true });
        }}
      >
        <div style={styles.title}>
          <Typography variant="h4" style={styles.titleText}>
            Battery Checker
          </Typography>
        </div>
        <div style={styles.iconContainer}>
          <img src={Icon} style={styles.icon} alt="Icon" />
        </div>
        <div style={styles.footer}>
          <Typography variant="subtitle2" style={styles.footerText}>
            Tap anywhere to continue
          </Typography>
        </div>
      </div>
    );
  };

  render() {
    return this.state.start ? <MainActivity /> : this.showHomePage();
  }
}

const styles = {
  homepage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,152,219,1) 0%, rgba(0,212,255,1) 100%)"
  },
  title: {
    width: "100%",
    height: "25%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  titleText: {
    fontWeight: "bold",
    color: "white"
  },
  footer: {
    width: "100%",
    height: "25%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  footerText: {
    marginBottom: "5%",
    color: "#F4F4F4"
  },
  iconContainer: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    margin: "20%"
  }
};

export default App;
