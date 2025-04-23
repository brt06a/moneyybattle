const startScreen = document.getElementById("startScreen");
const gameArea = document.getElementById("gameArea");
const scoreBoard = document.getElementById("scoreBoard");
const resultScreen = document.getElementById("resultScreen");
const gameTitle = document.getElementById("gameTitle");

let adsWatched = 0;
let playerScore = 0;
let gameInterval, timerInterval;
let timeLeft = 60;

// Dummy opponent names
const opponentNames = ["Ravi", "Pooja", "Anil", "Priya", "Raj", "Kiran", "Suman"];

// Tap sound
const tapSound = new Audio("sound.mp3");
const winSound = new Audio("win.mp3");

document.getElementById("watchAdsBtn").addEventListener("click", () => {
  adsWatched++;
  if (adsWatched >= 4) {
    startScreen.style.display = "none";
    scoreBoard.style.display = "flex";
    startGame();
  } else {
    alert(`Ad ${adsWatched} viewed! Watch ${4 - adsWatched} more.`);
  }
});

// Start the game
function startGame() {
  playerScore = 0;
  timeLeft = 60;
  updateScore();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) endGame();
  }, 1000);

  gameInterval = setInterval(spawnImage, 800);
}

// Update timer
function updateTimer() {
  document.getElementById("timer").innerText = `Time: ${timeLeft}s`;
}

// Update player score
function updateScore() {
  document.getElementById("playerScore").innerText = `Score: ${playerScore}`;
}

// Spawn falling colorful circles
function spawnImage() {
  const circle = document.createElement("div");
  circle.className = "falling";
  circle.style.left = Math.random() * 90 + "%";
  circle.style.backgroundColor = getRandomColor();
  circle.addEventListener("click", () => {
    playerScore += 2;
    updateScore();
    tapSound.currentTime = 0;
    tapSound.play();
    circle.remove();
  });

  circle.addEventListener("animationend", () => circle.remove());
  gameArea.appendChild(circle);
}

// Generate a random color
function getRandomColor() {
  const colors = ["#ff0055", "#00ccff", "#ffaa00", "#22ee66", "#9933ff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// End game
function endGame() {
  clearInterval(timerInterval);
  clearInterval(gameInterval);
  gameArea.innerHTML = "";
  scoreBoard.style.display = "none";

  const opponentName = opponentNames[Math.floor(Math.random() * opponentNames.length)];
  const opponentScore = playerScore - Math.floor(Math.random() * 20) - 1;

  winSound.play();

  resultScreen.innerHTML = `
    <h2>You Won!</h2>
    <p>Your Score: <strong>${playerScore}</strong></p>
    <p>Opponent: ${opponentName}</p>
    <p>Opponent Score: ${opponentScore}</p>
    <button onclick="location.reload()">Play Again</button>
  `;

  // Add 10,000 coins to user Firestore here (optional)
}
