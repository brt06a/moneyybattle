// Firebase initialization
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Game variables
let userCoins = 0;
let gameTimer;
let remainingTime = 60;
let score = 0;
let gameStarted = false;

// DOM elements
const startButton = document.getElementById("start-button");
const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const timerDisplay = document.getElementById("timer");
const gameBoard = document.getElementById("game-board");
const messageDisplay = document.getElementById("message");

// Helper function to update score
function updateScore() {
  scoreDisplay.innerText = "Score: " + score;
}

// Helper function to update timer
function updateTimer() {
  timerDisplay.innerText = "Time Left: " + remainingTime + "s";
}

// Fetch user data from Firestore based on UID
function fetchUserData(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (doc.exists) {
      userCoins = doc.data().coins;
      coinsDisplay.innerText = "Coins: " + userCoins;
    } else {
      messageDisplay.innerText = "UID not found. Please login first.";
    }
  }).catch(error => {
    console.error("Error fetching user data:", error);
  });
}

// Start game logic
function startGame() {
  if (userCoins >= 500) {
    // Deduct coins and start the game
    userCoins -= 500;
    updateCoinsInFirestore();
    gameStarted = true;
    remainingTime = 60;
    score = 0;
    updateScore();
    startButton.disabled = true; // Disable start button

    messageDisplay.innerText = "Game started! Click the falling balls!";
    gameLoop();
  } else {
    messageDisplay.innerText = "Not enough coins to start the game. Please go back and tap to earn coins.";
  }
}

// Update coins in Firestore after game or coin deduction
function updateCoinsInFirestore() {
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).update({
      coins: userCoins
    }).then(() => {
      coinsDisplay.innerText = "Coins: " + userCoins;
    }).catch(error => {
      console.error("Error updating coins:", error);
    });
  }
}

// Handle ball click event
function handleBallClick(ball) {
  ball.classList.add("clicked");
  score += 2; // Add points
  updateScore();
}

// Ball falling logic
function spawnBall() {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.top = "-50px"; // Start just above the game board
  ball.style.left = `${Math.random() * (gameBoard.offsetWidth - 50)}px`; // Random horizontal position

  ball.addEventListener("click", () => handleBallClick(ball));

  gameBoard.appendChild(ball);

  // Animate ball falling
  let ballFallInterval = setInterval(() => {
    let currentTop = parseFloat(ball.style.top);
    if (currentTop < gameBoard.offsetHeight - 50) {
      ball.style.top = `${currentTop + 2}px`; // Fall speed
    } else {
      clearInterval(ballFallInterval);
      gameBoard.removeChild(ball); // Remove ball after it falls off screen
    }
  }, 20);
}

// Game loop
function gameLoop() {
  gameTimer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimer();
      if (Math.random() < 0.2) {
        spawnBall(); // 20% chance to spawn a ball every frame
      }
    } else {
      endGame();
    }
  }, 1000);
}

// End game logic
function endGame() {
  clearInterval(gameTimer);
  gameStarted = false;
  startButton.disabled = false; // Enable the start button again

  const winChance = Math.random();
  if (winChance < 0.7) {
    messageDisplay.innerText = "You win! 10,000 coins added!";
    userCoins += 10000;
    updateCoinsInFirestore();
  } else {
    messageDisplay.innerText = "You lose! Better luck next time.";
  }
}

// Check if user is authenticated and fetch data
auth.onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    fetchUserData(uid);
  } else {
    messageDisplay.innerText = "Please log in first.";
  }
});

// Start button click handler
startButton.addEventListener("click", startGame);
