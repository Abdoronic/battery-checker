import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../Helpers/BluetoothLE";
import AvailableDevices from "./AvailableDevices";

function log(msg) {
  alert(msg);
}

class BatteryScanner extends Component {
  state = {
    foundDevices: [
      { name: "iPhone1", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone2", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone3", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone4", address: "AA:AA:AA:AA:AA:AA" },
      { name: "iPhone5", address: "AA:AA:AA:AA:AA:AA" }
    ],
    scanning: false
  };

  async componentDidMount() {
    alert(JSON.stringify(BluetoothLE));
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
      <div style={{ margin: "10%", textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={this.scan}>
          Scan
        </Button>
        <AvailableDevices foundDevices={this.state.foundDevices} />
      </div>
    );
  }
}

export default BatteryScanner;
