import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Vector2 from "./Vector2.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pointDistance: 6,
      pointHeight: 8,
      clothWidth: 70,
      clothHeight: 30,
      bounce: 0.9,
      gravity: 0.15,
      friction: 0.999,
      showPoint: true,
      paused: false
    };

    this.points = [];
    this.sticks = [];
  }

  handleClothWidthChange = e => {
    this.setState({
      clothWidth: e.target.value
    });
  };

  handleClothHeightChange = e => {
    this.setState(
      prevState => ({
        clothHeight: e.target.value
      }),
      () => {
        this.initializeCanvas();
      }
    );
  };

  handleShowPoints = e => {
    this.setState(
      prevState => ({
        showPoints: !prevState.showPoints
      }),
      () => {
        console.log(this.state);
      }
    );
  };

  handlePause = e => {
    this.setState(
      prevState => ({
        paused: !prevState.paused
      }),
      () => {
        if (!this.state.paused) {
          this.update();
        }
      }
    );
  };

  update = () => {
    this.updateCanvas();
    if (!this.state.paused) {
      requestAnimationFrame(this.update);
    }
  };

  constrainPoints = () => {
    this.points.forEach(point => {
      const vx = (point.x - point.oldX) * this.state.friction;
      const vy = (point.y - point.oldY) * this.state.friction;

      if (point.x > this.state.screenWidth) {
        point.x = 2 * this.state.screenWidth - point.x;
        point.oldX = point.x + vx * this.state.bounce;
      } else if (point.x < 0) {
        point.x = 0;
        point.oldX = point.x + vx * this.state.bounce;
      }

      if (point.y > this.state.screenHeight) {
        point.y = 2 * this.state.screenHeight - point.y;
        point.oldY = point.y + vy * this.state.bounce;
      } else if (point.y < 0) {
        point.y = 0;
        point.oldY = point.y + vy * this.state.bounce;
      }
    });
  };

  updatePoints = () => {
    this.points.forEach(point => {
      if (!point.pinned) {
        const vx = (point.x - point.oldX) * this.state.friction;
        const vy = (point.y - point.oldY) * this.state.friction;

        point.oldX = point.x;
        point.oldY = point.y;

        point.x += vx;
        point.y += vy;
        point.y += point.pinned ? 0 : this.state.gravity;
      }
    });
  };

  updateSticks = () => {
    this.sticks.forEach((stick, index) => {
      const dx = stick.p1.x - stick.p0.x;
      const dy = stick.p1.y - stick.p0.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const difference = stick.length - distance;
      var percent = difference / distance / 2;
      if (index === 0) console.log(percent);

      const offsetX = dx * percent;
      const offsetY = dy * percent;

      stick.p0.x -= stick.p0.pinned ? 0 : offsetX;
      stick.p0.y -= stick.p0.pinned ? 0 : offsetY;
      stick.p1.x += stick.p1.pinned ? 0 : offsetX;
      stick.p1.y += stick.p1.pinned ? 0 : offsetY;
    });
  };

  updateCanvas = () => {
    this.updatePoints();
    for (var i = 0; i < 10; i++) {
      this.updateSticks();
      this.constrainPoints();
    }
    this.drawCanvas();
  };

  drawCanvas = () => {
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.state.screenWidth, this.state.screenHeight);
    if (this.state.showPoints) {
      this.points.map(point => {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, Math.PI * 2);
        if (point.pinned) {
          context.fillStyle = "green";
        } else {
          context.fillStyle = "black";
        }
        context.fill();
      });
    }

    this.sticks.map(stick => {
      context.beginPath();
      context.moveTo(stick.p0.x, stick.p0.y);
      context.lineTo(stick.p1.x, stick.p1.y);
      context.stroke();
    });
  };

  initializeCanvas = () => {
    for (var i = 0; i < this.state.clothHeight; i++) {
      for (var j = 0; j < this.state.clothWidth; j++) {
        this.points.push(
          new Vector2(
            this.state.screenWidth / 2.25 + j * this.state.pointDistance,
            this.state.screenHeight / 5 + i * this.state.pointHeight,
            {
              oldX:
                this.state.screenWidth / 2.25 + j * this.state.pointDistance,
              oldY: this.state.screenHeight / 5 + i * this.state.pointHeight,
              pinned: false
            }
          )
        );
      }
    }

    var hOff = 0;
    for (var i = 0; i < this.state.clothHeight; i++) {
      for (var j = 0; j < this.state.clothWidth - 1; j++) {
        this.sticks.push({
          p0: this.points[j + hOff],
          p1: this.points[j + 1 + hOff],
          length: Vector2.distance(
            this.points[j + hOff],
            this.points[j + 1 + hOff]
          )
        });
      }
      hOff += this.state.clothWidth;
    }

    for (var i = 0; i < this.state.clothHeight - 1; i++) {
      for (var j = 0; j < this.state.clothWidth; j++) {
        this.sticks.push({
          p0: this.points[i * this.state.clothWidth + j],
          p1: this.points[(i + 1) * this.state.clothWidth + j],
          length: Vector2.distance(
            this.points[i * this.state.clothWidth + j],
            this.points[(i + 1) * this.state.clothWidth + j]
          )
        });
      }
    }

    this.points[0].pinned = true;
    this.points[this.state.clothWidth - 1].pinned = true;

    // for (var i = 0; i < this.state.clothWidth + 1; i += 10) {
    //   this.points[i].pinned = true;
    //   if (i === this.state.clothWidth) {
    //     this.points[i - 1].pinned = true;
    //   }
    // }
  };

  componentDidUpdate() {
    this.drawCanvas();
  }

  componentDidMount() {
    this.initializeCanvas();
    requestAnimationFrame(this.update);
  }

  render() {
    return (
      <div>
        <label>
          Cloth Width:
          <input
            type="text"
            name="Cloth Width"
            value={this.state.clothWidth}
            onChange={this.handleClothWidthChange}
          />
        </label>
        <label>
          Cloth Height:
          <input
            type="text"
            name="Cloth Height"
            value={this.state.clothHeight}
            onChange={this.handleClothHeightChange}
          />
        </label>
        <button
          name="Show Points"
          onClick={this.handleShowPoints}
          style={{ width: "3rem" }}
          value="Show Points"
        >
          Show Points
        </button>

        <button onClick={this.handlePause} style={{ width: "3rem" }}>
          Pause
        </button>

        <canvas
          id="canvas"
          ref={canvas => (this.canvas = canvas)}
          width={this.state.screenWidth}
          height={this.state.screenHeight}
        />
      </div>
    );
  }
}

export default App;
