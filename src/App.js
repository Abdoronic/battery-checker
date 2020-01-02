import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import Logger from "./components/Logger";
import BluetoothLE from "./Helpers/BluetoothLE";

class App extends Component {
  state = {
    logMessages: [],
    foundDevices: [],
    scanning: false,
    connecting: false,
    connected: null
  };

  async componentDidMount() {
    await BluetoothLE.initialize();
  }

  log = (content, type) => {
    let logMessages = this.state.logMessages;
    logMessages.push({
      id: logMessages.length,
      content: content,
      color: type === "error" ? "red" : "black"
    });
    this.setState({ logMessages: logMessages });
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

  scan = async () => {
    this.log(`Scanning`, "status");
    this.setState({ scanning: true });
    let foundDevices = [];
    try {
      foundDevices = await BluetoothLE.scan();
      this.log(`Found ${foundDevices.length} devices.`, "status");
    } catch (error) {
      this.log(error.error, "error");
    }
    this.setState({ foundDevices: foundDevices });
    this.setState({ scanning: false });
    this.log(JSON.stringify({ devices: foundDevices }), "status");
    this.log(`Done Scanning`, "status");
  };

  connect = async address => {
    alert("1");
    this.log(`Connecting to ${address}`, "status");
    alert("2");
    this.setState({ connecting: true });
    alert("3");
    let battery = { batteryLevel: "NA" };
    alert("4");
    let foundDevices = this.state.foundDevices;
    alert("5");
    try {
      alert("Enter Connect");
      battery = await BluetoothLE.connect(address);
      let idx = -1;
      for (let i = 0; i < foundDevices.length; i++)
        if (foundDevices[i].address === address) {
          idx = i;
          break;
        }
      this.log(`Connected to ${foundDevices[idx].name}.`, "status");
      this.log(`Battery Level is ${battery.batteryLevel}.`, "status");
      this.setState({ connected: address });
    } catch (error) {
      alert("Error: " + error.error);
      this.log(error.error, "error");
    }
    this.setState({ connecting: false });
    this.disconnect(address);
  };

  disconnect = async address => {
    this.log(`Disconnecting from ${address}`, "status");
    let foundDevices = this.state.foundDevices;
    try {
      await BluetoothLE.disconnect();
      let idx = -1;
      for (let i = 0; i < foundDevices.length; i++)
        if (foundDevices[i].address === address) {
          idx = i;
          break;
        }
      this.log(`Disconnected from ${foundDevices[idx].name}.`, "status");
    } catch (error) {
      this.log(error.error, "error");
    }
  };

  showDevices = () => {
    return this.state.foundDevices.map((device, index) => {
      return (
        <div
          key={index}
          style={{
            padding: "5px 0",
            borderBottom: "rgb(192,192,192) solid 1px"
          }}
        >
          {device.name}
          <Button
            id={index.toString()}
            variant="contained"
            color="primary"
            onClick={async ev => {
              await this.connect(this.state.foundDevices[ev.target.id].address);
            }}
          >
            Connect
          </Button>
        </div>
      );
    });
  };

  render() {
    return (
      <div style={{ margin: "10%", textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={this.scan}>
          Scan
        </Button>
        {this.showDevices()}
        {this.showLog()}
      </div>
    );
  }
}

export default App;
