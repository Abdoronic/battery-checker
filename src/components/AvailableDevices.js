import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import BluetoothLE from "../helpers/BluetoothLE";
import {
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  IconButton
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

function log(msg) {
  alert(msg);
}

class AvailableDevices extends Component {
  state = {
    connecting: false,
    connectedAddress: null,
    connected: false,
    success: false,
    batteryLevel: null,
    alert: false,
    alertMessage: "",
    alertVariant: "success"
  };

  async componentDidMount() {}

  connect = async address => {
    log(`Connecting to ${address}`, "status");
    this.setState({ connecting: true });
    this.props.onConnecting(true);
    this.setState({ connectedAddress: address });
    this.setState({ connected: false });
    this.setState({ success: false });
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
      this.setState({ batteryLevel: battery.batteryLevel });
    } catch (error) {
      log(error.error, "error");
    }
    if (!battery.batteryLevel) battery = { batteryLevel: "Not Available" };
    return battery;
  };

  disconnect = async address => {
    log(`Disconnecting from ${address}`, "status");
    let foundDevices = this.props.foundDevices;
    let idx = -1;
    try {
      await BluetoothLE.disconnect(address);
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
    this.props.onConnecting(false);
    this.setState({ connected: true });
    if (this.state.batteryLevel) this.setState({ success: true });
  };

  readBattery = async address => {
    let { batteryLevel } = await this.connect(address);
    await this.disconnect(address);
    log("Battery is: " + batteryLevel + "%");
  };

  showDevice = (device, index) => {
    return (
      <Paper key={index} style={styles.deviceBanner} elevation={3}>
        <table style={styles.deviceBannerBody}>
          <tbody>
            <tr>
              <td style={styles.deviceBannerName}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  {device.name && device.name !== ""
                    ? device.name
                    : device.address}
                </Typography>
                {device.address === this.state.connectedAddress &&
                this.state.success
                  ? `Battery: ${this.state.batteryLevel}%`
                  : " "}
              </td>
              <td style={styles.deviceBannerAction}>
                {device.address === this.state.connectedAddress &&
                this.state.connecting ? (
                  <CircularProgress size={24} style={styles.progress} />
                ) : (
                  <React.Fragment />
                )}
                <Button
                  id={index}
                  color="primary"
                  style={
                    device.address === this.state.connectedAddress &&
                    this.state.connecting
                      ? styles.readBatteryButtonDisabled
                      : styles.readBatteryButton
                  }
                  disabled={this.state.connecting || this.props.scanning}
                  // onClick={_ => {
                  //   this.readBattery(device.address);
                  // }}
                  onClick={_ => {
                    this.setState({ connecting: true });
                    this.props.onConnecting(true);
                    this.setState({ connectedAddress: device.address });
                    this.setState({ success: false, connected: false });
                    setTimeout(() => {
                      this.setState({ connecting: false });
                      this.props.onConnecting(false);
                      this.setState({ connected: true });
                      this.setState({ success: true });
                    }, 2000);
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

  showSnackBar = (message, variant, open) => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={_ => {
          this.setState({ alert: false });
        }}
      >
        <SnackbarContent
          style={
            variant === "error"
              ? { backgroundColor: "#d32f2f" }
              : { backgroundColor: "#43a047" }
          }
          message={
            <div style={styles.alertBoxBody}>
              {variant === "error" ? (
                <ErrorIcon style={{ marginRight: "10%" }} />
              ) : (
                <CheckCircleIcon style={{ marginRight: "10%" }} />
              )}
              {message}
            </div>
          }
          action={[
            <IconButton
              key="icon"
              color="inherit"
              onClick={_ => {
                this.setState({ alert: false });
              }}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  };

  render() {
    return (
      <div>
        {this.showDevices()}
        {this.showSnackBar("The message is not that long", "success", this.state.success)}
      </div>
    );
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
    background:
      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,152,219,1) 0%, rgba(0,212,255,1) 100%)",
    color: "white",
    borderRadius: "20px"
  },
  readBatteryButtonDisabled: {
    background:
      "linear-gradient(90deg, rgba(2,0,36,0.6) 0%, rgba(52,152,219,0.6) 0%, rgba(0,212,255,0.6) 100%)",
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
  },
  progress: {
    position: "absolute",
    color: "black",
    marginTop: "5px",
    marginLeft: "50px"
  },
  alertBoxBody: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  }
};

export default AvailableDevices;
