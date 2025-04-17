// tasks.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo6BwWCRTexL_-lUwgy41FYB3zpJKRiWU",
  authDomain: "money-master-89c02.firebaseapp.com",
  projectId: "money-master-89c02",
  storageBucket: "money-master-89c02.appspot.com",
  messagingSenderId: "226410161274",
  appId: "1:226410161274:web:62793ff8d39e0d642707c3",
  measurementId: "G-62K0SFSZK4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Globals
let currentUserUID = "";
let coinCount = 0;
let adEarnings = 0;

window.loadTasksPage = async function () {
  const user = auth.currentUser;

  if (!user) return;

  currentUserUID = user.uid;
  const userRef = doc(db, "users", currentUserUID);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    coinCount = data.coins || 0;
    adEarnings = data.adEarnings || 0;
    document.getElementById("coinDisplay").textContent = coinCount;
    document.getElementById("totalEarnings").textContent = adEarnings;
  }

  loadAdButtons();
};

function loadAdButtons() {
  const container = document.getElementById("adButtons");
  if (!container) return;

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Watch Ad #${i}`;
    btn.onclick = () => showAdAndReward(i);
    container.appendChild(btn);
  }
}

// Reward after confirming ad interaction
function showAdAndReward(index) {
  const clickSound = new Audio("assets/sound.mp3");
  clickSound.play();

  const script = document.createElement("script");
  script.src = "https://www.profitableratecpm.com/ibu3q4xj87?key=15bf92f761739f1b94851ca0199f3b33";
  script.async = true;
  document.body.appendChild(script);

  // Simulate ad duration
  setTimeout(() => {
    rewardUser();
  }, 10000); // 10 seconds to simulate ad watch
}

// Reward Logic
async function rewardUser() {
  const reward = 500;
  coinCount += reward;
  adEarnings += reward;

  document.getElementById("coinDisplay").textContent = coinCount;
  document.getElementById("totalEarnings").textContent = adEarnings;

  const userRef = doc(db, "users", currentUserUID);
  await updateDoc(userRef, {
    coins: coinCount,
    adEarnings: adEarnings
  });

  alert("✅ 500 coins added for watching the ad!");
}
