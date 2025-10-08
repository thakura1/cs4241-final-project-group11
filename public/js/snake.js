const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const restartBtn = document.getElementById("restart");

let COLS = 40; // Default
let ROWS = 40;
let CELL;
let offsetX = 0;
let offsetY = 0;

let layout = []
for (let i = 0; i < ROWS; i++) layout.push(Array(COLS).fill(0));

function resizeCanvas() {
  const guiHeight = 100; 
  const padding = 40;

  canvas.width = window.innerWidth - padding;
  canvas.height = window.innerHeight - guiHeight - padding;

  // Center canvas
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";

  // Recalculate cell size 
  CELL = Math.floor(Math.min(canvas.width, canvas.height) / COLS);
  ROWS = Math.floor(canvas.height / CELL);

  // Calculate offset to center the grid
  const gridWidth = COLS * CELL;
  const gridHeight = ROWS * CELL;
  offsetX = Math.floor((canvas.width - gridWidth) / 2);
  offsetY = Math.floor((canvas.height - gridHeight) / 2);

  // No negative offsets
  offsetX = Math.max(0, offsetX);
  offsetY = Math.max(0, offsetY);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  draw(); // redraw after resize
});

resizeCanvas();

let snake;
let dir;
let food;
let score;
let speed = 8; // frames per second
let gameInterval;
let isRunning = false;

// Initialize + Reset
function reset() {
  snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
  dir = { x: 1, y: 0 };
  placeFood();
  score = 0;
  speed = 8;
  scoreEl.textContent = score;
  speedEl.textContent = speed;
  isRunning = true;

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 1000 / speed);

  draw();
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    valid = !snake.some((s) => s.x === food.x && s.y === food.y && layout[food.y][food.x] === 0);
  }
}

// Main game loop: update + draw
function gameLoop() {
  if (isRunning) update();
  draw();
}

// Update position, check collisions, eat food
function update() {
  if (!isRunning) return;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return gameOver();
  }

  // Self collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head); // Add new head

  //  Eat Food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    placeFood();

    // Increase speed every 5 points
    if (score % 5 === 0 && speed < 20) {
      speed += 1;
      speedEl.textContent = speed;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, 1000 / speed);
    }
  } else {
    snake.pop(); // Remove tail
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isRunning) {
    // Draw overlay  -- REWRITE WITH TAILWIND LATER
    ctx.fillStyle = "#ff4757aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "16px Arial";
    ctx.fillText(
      "Press Restart to play again",
      canvas.width / 2,
      canvas.height / 2 + 20
    );

    return; // stop drawing snake/food
  }

  // Draw grid contents centered by translating the context
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Draw food
  drawRect(food.x, food.y, CELL * 0.9, CELL * 0.9, "#ff4757");

  for (let i = 0; i < ROWS; i++){
    for (let j = 0; j < COLS; j++){
      if (layout[i][j] === 1){
        drawRect(j, i, CELL, CELL, "#cccccc")
      }
    }
  }

  // Draw snake
  snake.forEach((seg, i) => {
    const size = i === 0 ? CELL * 0.95 : CELL * 0.85;
    const color = i === 0 ? "#10b981" : "#10b98150";
    drawRect(seg.x, seg.y, size, size, color);
  });

  // Draw walls
  ctx.strokeStyle = "#000000"; // border color
  ctx.lineWidth = 2;            // thickness of the walls
  ctx.strokeRect(0, 0, COLS * CELL, ROWS * CELL);

  // Restore context
  ctx.restore();
}

// Draw a rectangle
function drawRect(gridX, gridY, w, h, color) {
  const pad = (CELL - w) / 2;
  ctx.fillStyle = color;
  ctx.fillRect(gridX * CELL + pad, gridY * CELL + pad, w, h);
}

// Game over
function gameOver() {
  isRunning = false;
  clearInterval(gameInterval);
}

// Keyboard input: arrow keys + WASD
window.addEventListener("keydown", (e) => {
  if (!isRunning) return;

  const key = e.key;
  if ((key === "ArrowUp" || key === "w") && dir.y !== 1) dir = { x: 0, y: -1 };
  if ((key === "ArrowDown" || key === "s") && dir.y !== -1)
    dir = { x: 0, y: 1 };
  if ((key === "ArrowLeft" || key === "a") && dir.x !== 1)
    dir = { x: -1, y: 0 };
  if ((key === "ArrowRight" || key === "d") && dir.x !== -1)
    dir = { x: 1, y: 0 };
});

// Restart button
restartBtn.addEventListener("click", () => {
  reset();
});

window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  if(params.get("id")){
    const level = await fetch(`/levels/${params.get("id")}`, {
      method: "GET"
    })
    const levelText = await level.text();
    const levelJSON = JSON.parse(levelText)

    layout = levelJSON.layout;
    console.log(layout);
  }
  // Start game
  reset();
}



