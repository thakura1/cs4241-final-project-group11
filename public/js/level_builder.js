const canvas = document.getElementById("buildCanvas");
const ctx = canvas.getContext("2d");

let COLS = 40; // Default
let ROWS = 40;
let currX = 0;
let currY = 0;
let gameInterval;

let layout = []
for (let i = 0; i < ROWS; i++) layout.push(Array(COLS).fill(0));

function drawFilledRect(gridX, gridY, w, h, color) {
    const pad = (CELL - w) / 2;
    ctx.fillStyle = color;
    ctx.fillRect(gridX * CELL + pad, gridY * CELL + pad, w, h);
}

function drawEmptyRect(gridX, gridY, w, h, color){
    const pad = (CELL - w) / 2;
    ctx.fillStyle = color;
    ctx.fillRect(gridX * CELL + pad, gridY * CELL + pad, w, h);
    ctx.fillStyle = layout[gridY][gridX] === 1 ? "#cccccc" : "#ffffff"
    ctx.fillRect(gridX * CELL + pad + 3, gridY * CELL + pad + 3, w - 6, h - 6)
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recalculate cell size 
    CELL = Math.floor(Math.min(canvas.width, canvas.height) / COLS);

    ROWS = Math.floor(canvas.height / CELL);
}

function reset() {
  isRunning = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(loop, 1000 / 8);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ROWS; i++){
        for (let j = 0; j < COLS; j++){
            if (layout[i][j] === 1){
                drawFilledRect(j, i, CELL, CELL, "#cccccc")
            }
        }
    }
    drawEmptyRect(currX, currY, CELL*0.95, CELL*0.95, "#000000");
}

window.addEventListener("resize", () => {
    resizeCanvas();
});

window.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key === "ArrowUp" || key === "w") && currY > 0) 
        currY--;
    if ((key === "ArrowDown" || key === "s") && currY < ROWS - 1)
        currY++;
    if ((key === "ArrowLeft" || key === "a") && currX > 0)
        currX--;
    if ((key === "ArrowRight" || key === "d") && currX < COLS - 1)
        currX++;
    if ((key === "Enter")){
        layout[currY][currX] = layout[currY][currX] === 1 ? 0 : 1;
    }
    if ((key === "p")){
        console.log(layout);
    }
})

document.getElementById("clearGrid").onclick = () => {
    layout = []
    for (let i = 0; i < ROWS; i++) layout.push(Array(COLS).fill(0));
}

document.getElementById("uploadButton").onclick = async() => {
    const levelData = {
        title: document.getElementById("titleInput").value,
        layout: layout
    }

    const response = await fetch("/level", {
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(levelData)
    }).then(()=> alert("Uploaded to database!"))
}
resizeCanvas();
reset();