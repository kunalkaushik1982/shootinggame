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
    constructor(x, y, radius, color,velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity=velocity
    }
    draw() {
      context.beginPath();
      context.arc(this.x,this.y,this.radius,(Math.PI / 180) * 0,(Math.PI / 180) * 360,false);
      context.fillStyle = this.color;  
      context.fill();
    }
    update(){
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
  }
// ----------------------

const pla = new Player(playerPosition.x,playerPosition.y,15,` rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`);

const weapons = []

function animation() {
  requestAnimationFrame(animation);
  context.clearRect(0,0,canvas.width,canvas.height)
  pla.draw();
  weapons.forEach((item)=>{
    item.draw()
    item.update()
  })
}

canvas.addEventListener("click",(e) =>{
    const myAngle = Math.atan2(
        e.clientY-canvas.height/2,
        e.clientX-canvas.width/2
    )
    const velocity={x:Math.cos(myAngle)*5,y:Math.sin(myAngle)*5}
    weapons.push(new Weapon(canvas.width/2,canvas.height/2,6,"white",velocity))
})
animation();
