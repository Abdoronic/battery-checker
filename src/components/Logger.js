import React, { Component } from "react";

class Logger extends Component {
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
