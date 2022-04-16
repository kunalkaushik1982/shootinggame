const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext("2d");

playerPosition = { x: canvas.width / 2, y: canvas.height / 2 };
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
//   update() {
//     this.x += Math.random() * 10;
//     this.y += Math.random() * 10;
//   }
}

const pla = new Player(
  playerPosition.x,
  playerPosition.y,
  15,
  ` rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`
);

function animation() {
  requestAnimationFrame(animation);
  pla.draw();
  //pla.update();
}
animation();
