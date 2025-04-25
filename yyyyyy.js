import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
  authDomain: "money-master-official-site-new.firebaseapp.com",
  databaseURL: "https://money-master-official-site-new-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-master-official-site-new",
  storageBucket: "money-master-official-site-new.firebasestorage.app",
  messagingSenderId: "580013071708",
  appId: "1:580013071708:web:76363a43638401cda07599",
  measurementId: "G-26CBLGCKC1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const uid = localStorage.getItem("uid");

const dummyNames = [
  "Aryan", "Rohit", "Priya", "Sneha", "Karan", "Pooja", "Vikram", "Neha",
  "Ravi", "Meena", "Amit", "Divya", "Suresh", "Anjali", "Deepak", "Kavita",
  "Rahul", "Nisha", "Manish", "Alok", "Sakshi", "Gaurav", "Ritika", "Vivek"
];

const tapSound = new Audio("sound.mp3");
const winSound = new Audio("win.mp3");
const images = ["★", "♛", "☼", "✿", "✪"];

let playerScore = 0;
let dummyScore = 0;
let timeLeft = 60;
let gameStarted = false;

document.getElementById("startButton").addEventListener("click", async () => {
  if (gameStarted) return;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return alert("User not found.");
  const userData = userSnap.data();

  if (userData.coins < 500) return alert("Not enough coins to start the game.");

  await updateDoc(userRef, {
    coins: userData.coins - 500
  });

  document.getElementById("startButton").style.display = "none";
  document.getElementById("scoreboard").style.display = "block";
  document.getElementById("timer").textContent = `Time: ${timeLeft}s`;

  const dummyName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
  document.getElementById("opponent").textContent = `VS ${dummyName}`;

  gameStarted = true;
  startGame();
});

function startGame() {
  const gameArea = document.getElementById("gameArea");
  const timerDisplay = document.getElementById("timer");

  const interval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      endGame();
    }
  }, 1000);

  spawnImages(gameArea);
}

function spawnImages(container) {
  const interval = setInterval(() => {
    if (!gameStarted) {
      clearInterval(interval);
      return;
    }

    const img = document.createElement("div");
    img.className = "tap-image";
    img.innerHTML = images[Math.floor(Math.random() * images.length)];
    img.style.left = Math.random() * 90 + "%";
    img.style.top = "-5%";

    img.addEventListener("click", () => {
      tapSound.play();
      playerScore++;
      updateScoreDisplay();
      img.remove();
    });

    container.appendChild(img);

    let move = 0;
    const fall = setInterval(() => {
      move += 2;
      img.style.top = move + "%";
      if (move >= 100) {
        clearInterval(fall);
        img.remove();
      }
    }, 50);

    dummyScore += Math.random() < 0.7 ? 1 : 0;
    updateScoreDisplay();
  }, 700);
}

function updateScoreDisplay() {
  document.getElementById("playerScore").textContent = `You: ${playerScore}`;
  document.getElementById("dummyScore").textContent = `Opponent: ${dummyScore}`;
}

async function endGame() {
  gameStarted = false;
  document.getElementById("result").style.display = "block";
  document.getElementById("startButton").style.display = "block";

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (playerScore > dummyScore) {
    winSound.play();
    document.getElementById("result").textContent = "You Win! +5000 Coins";

    await updateDoc(userRef, {
      coins: userData.coins + 5000
    });
  } else {
    document.getElementById("result").textContent = "You Lose!";
  }

  playerScore = 0;
  dummyScore = 0;
  timeLeft = 60;
  document.getElementById("scoreboard").style.display = "none";
  document.getElementById("opponent").textContent = "";
}
