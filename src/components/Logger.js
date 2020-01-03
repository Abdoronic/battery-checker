import React, { Component } from "react";
import { Button } from "@material-ui/core";

class Logger extends Component {

  state = {
    logMessages: []
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

  render() {
    return (
      <div style={{ margin: "10%", textAlign: "center" }}>
        <h5>Log</h5>
        {this.props.logs.map(msg => {
          return (
            <div
              key={msg.id}
              style={{
                padding: "5px 0",
                borderBottom: "rgb(192,192,192) solid 1px",
                color: msg.color
              }}
            >
              {msg.content}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Logger;
