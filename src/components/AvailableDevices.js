import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../helpers/BluetoothLE";
import { Paper, Typography } from "@material-ui/core";

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
    alert("Battery is: " + batteryLevel + "%");
  };

  showDevice = (device, index) => {
    return (
      <Paper key={index} style={styles.deviceBanner} elevation={3}>
        <table style={styles.deviceBannerBody}>
          <tbody>
            <tr>
              <td style={styles.deviceBannerName}>
                <Typography variant="subtitle1" style={{fontWeight: "bold"}}>
                  {device.name && device.name !== ""
                    ? device.name
                    : device.address}
                </Typography>
              </td>
              <td style={styles.deviceBannerAction}>
                <Button
                  id={index}
                  style={styles.readBatteryButton}
                  color="primary"
                  onClick={_ => {
                    this.readBattery(device.address);
                  }}
                >
                  Read Battery
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Paper>
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
    return <div>{this.showDevices()}</div>;
  }
}

const styles = {
  deviceBanner: {
    height: "80px",
    marginBottom: "6%",
    borderRadius: "12px",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 20px"
  },
  readBatteryButton: {
    background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,152,219,1) 0%, rgba(0,212,255,1) 100%)",
    color: "white",
    borderRadius: "20px"
  },
  deviceBannerBody: {
    width: "100%",
    height: "100%"
  },
  deviceBannerName: {
    textAlign: "left",
    paddingLeft: "5%"
  },
  deviceBannerAction: {
    textAlign: "right",
    paddingRight: "5%"
  }
};

export default AvailableDevices;
