import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../helpers/BluetoothLE";

function log(msg) {
  alert(msg);
}

class AvailableDevices extends Component {
  state = {
    connecting: false,
    connected: null
  };

  async componentDidMount() {}

  connect = async address => {
    log(`Connecting to ${address}`, "status");
    this.setState({ connecting: true });
    let battery = { batteryLevel: "Not Available" };
    let foundDevices = this.props.foundDevices;
    try {
      alert("Enter Connect");
      battery = await BluetoothLE.connect(address);
      let idx = -1;
      for (let i = 0; i < foundDevices.length; i++)
        if (foundDevices[i].address === address) {
          idx = i;
          break;
        }
      log(`Connected to ${foundDevices[idx].name}.`, "status");
      log(`Battery Level is ${battery.batteryLevel}.`, "status");
      this.setState({ connected: address });
    } catch (error) {
      alert("Error: " + error.error);
      log(error.error, "error");
    }
    if (!battery.batteryLevel) battery = { batteryLevel: "Not Available" };
    return battery;
  };

  disconnect = async address => {
    log(`Disconnecting from ${address}`, "status");
    let foundDevices = this.props.foundDevices;
    try {
      await BluetoothLE.disconnect(address);
      let idx = -1;
      for (let i = 0; i < foundDevices.length; i++)
        if (foundDevices[i].address === address) {
          idx = i;
          break;
        }
      log(`Disconnected from ${foundDevices[idx].name}.`, "status");
    } catch (error) {
      log(error.error, "error");
    }
    this.setState({ connecting: false });
  };

  readBattery = async address => {
    let { batteryLevel } = await this.connect(address);
    await this.disconnect(address);
    log("Battery is: " + batteryLevel + "%");
  };

  showDevice = (device, index) => {
    return (
      <div
        key={index}
        style={{
          padding: "5px 0",
          borderBottom: "rgb(192,192,192) solid 1px"
        }}
      >
        {device.name && device.name !== "" ? device.name : device.address}
        <Button
          id={index}
          variant="contained"
          color="primary"
          onClick={_ => {
            this.readBattery(device.address);
          }}
        >
          Connect
        </Button>
      </div>
    );
  };

  showDevices = () => {
    let foundDevices = this.props.foundDevices;
    return foundDevices.map(
      (device, index) => this.showDevice(device, index),
      this
    );
  };

  render() {
    return (
      <div style={{ margin: "10%", textAlign: "center" }}>
        {this.showDevices()}
      </div>
    );
  }
}

export default AvailableDevices;
