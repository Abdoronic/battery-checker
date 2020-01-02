import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import Logger from "./components/Logger";

const ble = window.bluetoothle;

class App extends Component {
  state = {
    logMessages: [],
    foundDevices: []
  };

  log = (content, type) => {
    let logMessages = this.state.logMessages;
    logMessages.push({
      id: logMessages.length,
      content: content,
      color: type === "error" ? "red" : "black"
    });
    this.setState({ logMessages: logMessages });
  };

  handleError = error => {
    var msg;

    if (error.error && error.message) {
      var errorItems = [];

      if (error.service) {
        errorItems.push("service: " + (error.service || error.service));
      }

      if (error.characteristic) {
        errorItems.push(
          "characteristic: " + (error.characteristic || error.characteristic)
        );
      }

      msg =
        "Error on " +
        error.error +
        ": " +
        error.message +
        (errorItems.length && " (" + errorItems.join(", ") + ")");
    } else {
      msg = error;
    }

    this.log(msg, "error");
  };

  initialize = () => {
    new Promise(function(resolve) {
      ble.initialize(resolve, { request: true, statusReceiver: false });
    }).then(this.initializeSuccess, this.handleError);
  };

  initializeSuccess = result => {
    if (result.status === "enabled") {
      this.log("Bluetooth is enabled.", "status");
      this.log(JSON.stringify(result), "status");
    } else {
      this.log("Bluetooth is not enabled:", "status");
      this.log(JSON.stringify(result), "status");
    }
    ble.hasPermission(this.hasPermissionSuccess);
    ble.requestPermission(this.requestPermissionSuccess, this.handleError);
  };

  hasPermissionSuccess = result => {
    this.log(JSON.stringify(result, "status"));
  };

  requestPermissionSuccess = result => {
    this.log(JSON.stringify(result, "status"));
    ble.hasPermission(this.hasPermissionSuccess);
  };

  startScan = () => {
    this.log("Starting scan for devices...", "status");
    this.setState({ foundDevices: [] });
    ble.startScan(this.startScanSuccess, this.handleError, { services: [] });
  };

  startScanSuccess = result => {
    if (result.status === "scanStarted") {
      this.log(
        "Scanning for devices (will continue to scan until you select a device)...",
        "status"
      );
    } else if (result.status === "scanResult") {
      if (
        !this.state.foundDevices.some(function(device) {
          return device.address === result.address;
        })
      ) {
        this.log("FOUND DEVICE:", "status");
        this.log(JSON.stringify(result), "status");
        let foundDevices = this.state.foundDevices;
        foundDevices.push(result);
        this.setState({ foundDevices: foundDevices });
        if (result.name === "iphone") this.connect(result.address);
        // addDevice(result.name, result.address);
      }
    }
  };

  connect = address => {
    this.log("Connecting to device: " + address + "...", "status");
    this.stopScan();
    new Promise(function(resolve, reject) {
      ble.connect(resolve, reject, { address: address });
    }).then(this.connectSuccess, this.handleError);
  };

  stopScan = () => {
    new Promise(function(resolve, reject) {
      ble.stopScan(resolve, reject);
    }).then(this.stopScanSuccess, this.handleError);
  };

  stopScanSuccess = () => {
    if (!this.state.foundDevices.length) {
      this.log("NO DEVICES FOUND");
    } else {
      this.log(
        "Found " + this.state.foundDevices.length + " devices.",
        "status"
      );
    }
  };

  connectSuccess = result => {
    this.log("- " + result.status, "status");
    if (result.status === "connected") {
      this.log("Connected to device: " + result.address, "status");
      this.getDeviceServices(result.address);
    } else if (result.status === "disconnected") {
      this.log("Disconnected from device: " + result.address, "status");
      this.closeConnection(result);
    } else if (result.status === "closed") {
      this.log("Closed device: " + result.address, "status");
    }
  };

  closeConnection = result => {
    new Promise(function(resolve, reject) {
      ble.close(resolve, reject, { address: result.address });
    }).then(this.connectSuccess, this.handleError);
  };

  getDeviceServices = address => {
    this.log("Getting device services...", "status");
    new Promise(function(resolve, reject) {
      ble.discover(resolve, reject, { address: address });
    }).then(this.discoverSuccess, this.handleError);
  };

  discoverSuccess = result => {
    this.log("Discover returned with status: " + result.status, "status");

    if (result.status === "discovered") {
      var hasBatteryService = false;
      result.services.forEach(service => {
        if (service.uuid === "180f" || service.uuid === "180F") {
          hasBatteryService = true;
          this.read(result.address, service.uuid, "2a19");
        }
      });

      if (!hasBatteryService)
        this.log("Device has no battery service", "error");
    }
  };

  read = (address, service, characteristic) => {
    this.log("Reading the battery of device...", "status");
    new Promise(function(resolve, reject) {
      ble.read(resolve, reject, {
        address: address,
        service: service,
        characteristic: characteristic
      });
    }).then(this.readSuccess, this.handleError);
  };

  readSuccess = result => {
    this.log("success reading battery", "status");
    let batteryPercentage = ble.encodedStringToBytes(result.value);
    this.log(`Battery Level is: ${batteryPercentage}%`, "status");
    new Promise(function(resolve, reject) {
      ble.disconnect(resolve, reject, { address: result.address });
    }).then(this.connectSuccess, this.handleError);
  };

  showLog = () => {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "5%" }}
          onClick={ev => {
            this.setState({ logMessages: [] });
          }}
        >
          Clear Log
        </Button>
        <Logger logs={this.state.logMessages} />
      </div>
    );
  };

  render() {
    return (
      <div style={{ margin: "10%", textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={this.initialize}>
          Initialize
        </Button>
        <Button variant="contained" color="primary" onClick={this.startScan}>
          Start Scan
        </Button>
        {this.showLog()}
      </div>
    );
  }
}

export default App;
