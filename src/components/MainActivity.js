import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../helpers/BluetoothLE";
import AvailableDevices from "./AvailableDevices";
import { keyframes } from "styled-components";

function log(msg) {
  alert(msg);
}

class MainActivity extends Component {
  state = {
    foundDevices: [
      { name: "iPhone1", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone2", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone3", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone4", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone5", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone6", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone7", address: "AA:AA:AA:AA:AA:AA" }
    ],
    scanning: false
  };

  async componentDidMount() {
    await BluetoothLE.initialize();
  }

  scan = async () => {
    log(`Scanning`, "status");
    this.setState({ scanning: true });
    let foundDevices = [];
    try {
      foundDevices = await BluetoothLE.scan();
      log(`Found ${foundDevices.length} devices.`, "status");
    } catch (error) {
      log(error.error, "error");
    }
    this.setState({ foundDevices: foundDevices });
    this.setState({ scanning: false });
    log(JSON.stringify({ devices: foundDevices }), "status");
    log(`Done Scanning`, "status");
  };

  render() {
    return (
      <div style={styles.view}>
        <div style={styles.scanner}>
          <Button
            style={{
              ...styles.circle,
              animation: this.state.scanning
                ? `${Animations.pulse} 2s infinite`
                : ""
            }}
            onClick={this.scan}
          >
            scan
          </Button>
        </div>
        <AvailableDevices foundDevices={this.state.foundDevices} />
      </div>
    );
  }
}

const Animations = {
  pulse: keyframes`
    0% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 40px rgba(52, 152, 219, 0);
    }
    100% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
    }
  `
};

const styles = {
  view: {
    marginLeft: "4%",
    marginRight: "4%",
    marginTop: "10%",
    marginBottom: "10%",
    textAlign: "center"
  },
  scanner: {
    margin: 0,
    height: "220px",
    display: "flex",
    alignItems: "center",
    marginBottom: "10%",
    justifyContent: "center"
  },
  circle: {
    animation: `${Animations.pulse} 2s infinite`,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 20px",
    //backgroundColor: "rgba(52, 152, 219, 1.0)",
    background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,152,219,1) 0%, rgba(0,212,255,1) 100%)",
    borderRadius: "50%",
    height: "100px",
    width: "100px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "White"
  }
};

export default MainActivity;
