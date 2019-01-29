import React, { Component } from "react";

export default class Canvas extends Component {
  render() {
    return (
      <div>
        <canvas ref="canvas" />
      </div>
    );
  }
}
