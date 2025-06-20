window.addEventListener("load", start);

const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false,
};

let points = 0;

const objects = [];

const object = {
  x: 380,
  y: 370,
  s: 300,
  w: 60,
  h: 80,
  hl: 100,
};

let lastTime = 0;

function start() {
  console.log("JavaScript is running");

  document.addEventListener("keydown", keypressHandler);
  document.addEventListener("keyup", keypressHandler);

  const gamefield = document.querySelector("#gamefield");
  if (!gamefield) {
    console.error("Missing #gamefield element in HTML");
    return;
  }

  for (let i = 0; i < 10; i++) {
    const div = document.createElement("div");
    div.classList.add("asteroid");

    gamefield.insertAdjacentElement("beforeend", div);

    const obj = {
      x: Math.floor(Math.random() * 750),
      y: -30,
      w: 50,
      h: 50,
      s: Math.random() * 100 + 50,
      visual: div,
    };
    objects.push(obj);
  }

  requestAnimationFrame(tick);
}

function keypressHandler(event) {
  const value = event.type === "keydown";
  const key = event.key.toLowerCase();
  if (key === "a" || key === "arrowleft") controls.left = value;
  if (key === "w" || key === "arrowup") controls.up = value;
  if (key === "s" || key === "arrowdown") controls.down = value;
  if (key === "d" || key === "arrowright") controls.right = value;
}

function tick(timestamp) {
  requestAnimationFrame(tick);

  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (controls.left && object.x > object.w / 2) {
    object.x -= object.s * delta;
  } else if (controls.right && object.x < 770) {
    object.x += object.s * delta;
  }

  if (controls.up && object.y > object.h / 2) {
    object.y -= object.s * delta;
  } else if (controls.down && object.y < 410) {
    object.y += object.s * delta;
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].y += objects[i].s * delta;
    if (objects[i].y > 450) {
      objects[i].y = -30;
      objects[i].x = Math.floor(Math.random() * 750);
    }
  }

  for (let i = 0; i < objects.length; i++) {
    const dx = objects[i].x - object.x;
    const dy = objects[i].y - object.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < objects[i].w / 2 + object.w / 2) {
      objects[i].s *= 0.95;
      object.hl--;
    }
  }

  const visualSpaceShip = document.querySelector(".spaceship");
  if (visualSpaceShip) {
    visualSpaceShip.style.transform = `translate(${object.x - object.w / 2}px, ${object.y - object.h / 2}px)`;
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].visual.style.transform = `translate(${objects[i].x - 25}px, ${objects[i].y - 25}px)`;
  }

  const scoreElement = document.querySelector("#score #number");
  if (scoreElement) {
    scoreElement.textContent = String(points).padStart(3, "0");
  }

  const healthbar = document.querySelector("#healthbar");
  if (healthbar) {
    healthbar.style.width = `${object.hl}%`;
  }
}
