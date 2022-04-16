// Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play();
//Basic Environment Setup

const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let playScore = 0;

//Basic Function
//Event Listener for Difficulty Form
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();

  // Stoping Music
  introMusic.pause();

  //Making form invisible
  form.style.display = "none";

  //Making Score Board visible
  scoreBoard.style.display = "block";

  //Getting Difficulty level selected by user
  const userValue = document.getElementById("difficulty").value;
  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 5);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 1400);
    return (difficulty = 8);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 10);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 700);
    return (difficulty = 12);
  }
});

// Endscreen
const gameoverLoader = () => {
  // Creating endscreen div and play again button and high score element
  const gameOverBanner = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  highScore.innerHTML = `High Score : ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : playScore
  }`;

  const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playScore) {
    localStorage.setItem("highScore", playScore);

    // updating high score html
    highScore.innerHTML = `High Score: ${playScore}`;
  }

  // adding text to playagain button
  gameOverBtn.innerText = "Play Again";

  gameOverBanner.appendChild(highScore);

  gameOverBanner.appendChild(gameOverBtn);

  // Making reload on clicking playAgain button
  gameOverBtn.onclick = () => {
    window.location.reload();
  };

  gameOverBanner.classList.add("gameover");

  document.querySelector("body").appendChild(gameOverBanner);
};

// ---------------------Creating Player Weapon & Enenmy Classes-----------------------------

//Setting Player Postion to center
playerPosition = { x: canvas.width / 2, y: canvas.height / 2 };

//Creating Player
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
}

//Creating Weapon Class
class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
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
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//Creating Huge Weapon Class
class HugeWeapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgba(255,0,133,1)";
  }
  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }
  update() {
    this.draw();
    this.x += 20;
  }
}

//Creating Enemy Class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
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
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//Creating Particle Class
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    context.save();
    context.globalAlpha = this.alpha;
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
    context.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}
// -----------------------------------------Main Logic Begins here----------------------------------------

//Creating Player Object, Weapons array, Enemy array
const pla = new Player(playerPosition.x, playerPosition.y, 15, "white");
const weapons = [];
const hugeWeapons = [];
const enemies = [];
const particles = [];

//-----------------------------Function to create Spawn Enemy at random location-----------------------------
const spawnEnemy = () => {
  //Generating Random Size for Enemy
  const enemySize = Math.random() * (40 - 5) + 5;
  //Generating Random Color for Enemy
  const enemyColor = ` hsl(${Math.floor(Math.random() * 360)},100%,50%)`;

  //Random Enemy Spwan Position
  let random;

  //Making enemy location random but only from outsize of screen
  if (Math.random() < 0.5) {
    // Making X equal to very left off of screen or very right off of screen and setting Y to any where vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    // Making Y equal to very up off of screen or very down off of screen and setting X to any where horizontally
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  // Finding Angle between center (means Player Position) and enemy position
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );

  // Making velocity or speed of enemy by multipling chosen difficulty to radian
  const velocity = { x: Math.cos(myAngle) * 5, y: Math.sin(myAngle) * 5 };

  // Adding enemy to enemies array
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// ------------------------------------------------Creating Animation Function ---------------------------------------
let animationId;
function animation() {
  // Making Recursion
  animationId = requestAnimationFrame(animation);

  // Clearing canvas on each frame
  context.fillStyle = "rgba(49,49,49,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //Drawing Player
  pla.draw();

  //Generating Particles
  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.slice(particleIndex, 1);
    } else {
      particle.update();
    }
  });

  //Generating Huge Weapons
  hugeWeapons.forEach((hugeweapon, hugeweaponIndex) => {
    if (hugeweapon.x > canvas.width) {
      hugeWeapons.splice(hugeweaponIndex, 1);
    } else {
      hugeweapon.update();
    }
  });

  //Generating Bullets
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();
    //Removing Weapons when they are offscreen
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  //Generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    //Finding distance between Player and enemies
    const distanceBetweenPlayerAndEnemy = Math.hypot(
      pla.x - enemy.x,
      pla.y - enemy.y
    );

    //Stopping Game if enemy hit player
    if (distanceBetweenPlayerAndEnemy - pla.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play();
      return gameoverLoader();
    }

    hugeWeapons.forEach((hugeweapon) => {
      //Finding distance between huge weapon and enemy
      const distanceBetweenHugeWeaponAndEnemy = hugeweapon.x - enemy.x;
      if (
        distanceBetweenHugeWeaponAndEnemy <= 200 &&
        distanceBetweenHugeWeaponAndEnemy > -200
      ) {
        // Increasing player score when killing one enemy
        playScore += 10;
        setTimeout(() => {
          killEnemySound.play();
          enemies.splice(enemyIndex, 1);
        }, 0);
      }
    });

    weapons.forEach((weapon, weaponIndex) => {
      //Finding distance between Weapon and enemy
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );
      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        killEnemySound.play();
        //Reducing size of enemy on hit
        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
        //Removing enemy on hit if they are below 18
        else {
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: Math.random() - 0.5 + Math.random() * 7,
                y: Math.random() - 0.5 + Math.random() * 7,
              })
            );
          }
          // Increasing player score when killing one enemy
          playScore += 10;

          //Rendering player Score in score board html element
          scoreBoard.innerHTML = `Score:${playScore}`;          
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}

//---------------------------------------------Adding Event Listener---------------------------------------------

// Event Listener for Light Weapon aka left click
canvas.addEventListener("click", (e) => {
  shootingSound.play();
  //finding angle between player position(center) and click co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  //Making const speed for light weapon
  const velocity = { x: Math.cos(myAngle) * 6, y: Math.sin(myAngle) * 6 };

  //Adding Light weapon in weapons array
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});

// ---------------------------Event Listener for Heavy weapon aka right click---------------------------
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  heavyWeaponSound.play();
  if (playScore <= 0) {
    return;
  }

  //Decreasing Player Score for using heavy weapon
  playScore -= 2;

  //Rendering player Score in score board html element
  scoreBoard.innerHTML = `Score:${playScore}`;

  //finding angle between player position(center) and click co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  //Making const speed for heavy weapon
  const velocity = { x: Math.cos(myAngle) * 3, y: Math.sin(myAngle) * 3 };

  //Adding heavy weapon in weapons array
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      30,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});

addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (playScore < 20) {
      return;
    }

    //Decreasing Player Score for using huge weapon
    playScore -= 20;

    //Rendering player Score in score board html element
    scoreBoard.innerHTML = `Score:${playScore}`;
    hugeWeaponSound.play();
    hugeWeapons.push(new HugeWeapon(0, 0, hugeWeaponDamage));
  }
});

addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

addEventListener("resize", (e) => {
  window.location.reload();
});
animation();
