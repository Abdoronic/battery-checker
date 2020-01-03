import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../helpers/BluetoothLE";
import AvailableDevices from "./AvailableDevices";

function log(msg) {
  alert(msg);
}

class MainActivity extends Component {
  state = {
    foundDevices: [],
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
      <div style={{ margin: "10%", textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={this.scan}>
          Scan
        </Button>
        <AvailableDevices foundDevices={this.state.foundDevices}/>
      </div>
    );
  }
}

export default MainActivity;
