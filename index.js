const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);

canvas.width=innerWidth
canvas.height=innerHeight

const context = canvas.getContext("2d");

context.beginPath();
context.arc(100, 100, 10, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
context.stroke()

