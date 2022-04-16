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
    context.arc(this.x,this.y,this.radius,(Math.PI / 180) * 0,(Math.PI / 180) * 360,false);
    context.fillStyle = this.color;
    context.fill();
  }
}

//------------------
class Weapon {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }
    draw() {
      context.beginPath();
      context.arc(this.x,this.y,this.radius,(Math.PI / 180) * 0,(Math.PI / 180) * 360,false);
      context.fillStyle = this.color;  
      context.fill();
    }
  }
// ----------------------

const pla = new Player(playerPosition.x,playerPosition.y,15,` rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`);

const weapons = []

function animation() {
  requestAnimationFrame(animation);
  pla.draw();
  weapons.forEach((Weapon)=>{
      Weapon.draw()
  })
}

canvas.addEventListener("click",(e) =>{
    weapons.push(new Weapon(e.clientX,e.clientY,6,"white"))
})
animation();
