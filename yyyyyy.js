// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elements
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const timerEl = document.getElementById("timeLeft");
const scoreEl = document.getElementById("playerScore");
const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const resultOverlay = document.getElementById("resultOverlay");
const finalScoreEl = document.getElementById("finalScore");
const opponentNameEl = document.getElementById("opponentName");
const opponentScoreEl = document.getElementById("opponentScore");

const colors = ["#FF5E5E", "#5EFF9D", "#5EDBFF", "#FFA45E", "#D95EFF"];
const opponentNames = [
  "Aryan", "Rohit", "Priya", "Sneha", "Aditya",
  "Kiran", "Vikram", "Pooja", "Neha", "Raj", "Tanya", "Rishi"
];

let score = 0;
let timeLeft = 60;
let gameInterval;
let spawnInterval;
let userUID = localStorage.getItem("uid");
let userRef = null;

// Load user and deduct entry coins
async function setupUser() {
  if (!userUID) {
    alert("You must be logged in to play.");
    startBtn.disabled = true;
    return;
  }

  userRef = db.collection("users").doc(userUID);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    alert("User not found.");
    startBtn.disabled = true;
    return;
  }

  const userData = userDoc.data();
  if (userData.coins < 50) {
    alert("Not enough coins. You need at least 50 coins to play.");
    startBtn.disabled = true;
    return;
  }

  // Deduct 50 coins for entry
  await userRef.update({
    coins: firebase.firestore.FieldValue.increment(-50)
  });
}

// Game logic
function startGame() {
  startBtn.style.display = "none";
  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  resultOverlay.style.display = "none";

  gameInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(spawnBall, 800);
}

function updateTimer() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function spawnBall() {
  const ball = document.createElement("div");
  ball.className = "ball";
  const size = 60;
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;
  ball.style.left = `${Math.random() * (gameArea.clientWidth - size)}px`;
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.animationDuration = `${2 + Math.random() * 2}s`;
  gameArea.appendChild(ball);

  ball.addEventListener("click", () => {
    score += 2;
    scoreEl.textContent = score;
    tapSound.currentTime = 0;
    tapSound.play();
    ball.remove();
  });

  setTimeout(() => {
    ball.remove();
  }, 4000);
}

async function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameArea.innerHTML = "";

  const opponentName = opponentNames[Math.floor(Math.random() * opponentNames.length)];
  const opponentScore = score - Math.floor(Math.random() * 20) - 1;

  opponentNameEl.textContent = opponentName;
  opponentScoreEl.textContent = opponentScore;
  finalScoreEl.textContent = score;
  resultOverlay.style.display = "flex";
  winSound.play();

  // Reward 10,000 coins if player wins
  if (score > opponentScore) {
    await userRef.update({
      coins: firebase.firestore.FieldValue.increment(10000)
    });
  }
}

startBtn.addEventListener("click", () => {
  startGame();
});

// Setup on load
setupUser();
