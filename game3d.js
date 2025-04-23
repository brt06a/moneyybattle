// game3d.js

const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const resultOverlay = document.getElementById("resultOverlay");
const resultText = document.getElementById("resultText");
const opponentNameEl = document.getElementById("opponentName");
const soundTap = new Audio("sound.mp3");
const soundWin = new Audio("win.mp3");

let score = 0;
let timeLeft = 60;
let gameInterval;
let spawnInterval;
let opponentScore = 0;
let opponentName = "";

const colors = ["#ff4e50", "#00c6ff", "#f9d423", "#a18cd1", "#43e97b"];

function getRandomName() {
  const names = ["Ravi", "Amit", "Priya", "Neha", "Rahul", "Anjali", "Karan"];
  return names[Math.floor(Math.random() * names.length)];
}

function createImage() {
  const img = document.createElement("div");
  img.className = "falling-image";
  img.style.background = `radial-gradient(circle at top left, ${colors[Math.floor(Math.random() * colors.length)]}, white)`;
  img.style.left = `${Math.random() * 90 + 5}%`;

  img.addEventListener("click", () => {
    score += 2;
    scoreEl.textContent = `Score: ${score}`;
    soundTap.currentTime = 0;
    soundTap.play();
    img.remove();
  });

  gameArea.appendChild(img);

  setTimeout(() => {
    if (gameArea.contains(img)) {
      img.remove();
    }
  }, 3000);
}

function updateTimer() {
  timerEl.textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) {
    endGame();
    return;
  }
  timeLeft--;
}

function startGame() {
  score = 0;
  timeLeft = 60;
  opponentScore = score + Math.floor(Math.random() * 20 + 1);
  opponentName = getRandomName();

  scoreEl.textContent = "Score: 0";
  timerEl.textContent = "Time: 60s";
  resultOverlay.style.display = "none";
  startBtn.style.display = "none";

  gameInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(createImage, 600);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  // Remove all remaining images
  document.querySelectorAll(".falling-image").forEach((img) => img.remove());

  resultOverlay.style.display = "flex";
  resultText.textContent = `You Won! +10,000 Coins`;
  opponentNameEl.textContent = `Opponent: ${opponentName} scored ${opponentScore}`;
  soundWin.play();

  // TODO: Add coins to wallet if connected to Firestore
}

startBtn.addEventListener("click", startGame);
