import Vector2 from "./Vector2.js";

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const points = [];

  points.push(new Vector2(100, 100), { oldX: 95, oldY: 95 });

  points.push(new Vector2(200, 100), { oldX: 195, oldY: 95 });

  update();

  update = () => {
    updatePoints();
    renderPoints();
    requestAnimationFrame(update);
  };

  updatePoints = () => {
    points.forEach(point => {
      vx = point.x - point.oldX;
      vy = point.y - point.oldY;

      point.oldX = point.x;
      point.oldY = point.y;

      point.x += vx;
      point.y += vy;
    });
  };

  renderPoints = () => {
    context.clearRect(0, 0, width, height);
    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
    });
  };
};
