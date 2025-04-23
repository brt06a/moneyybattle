import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  increment,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
  authDomain: "money-master-official-site-new.firebaseapp.com",
  projectId: "money-master-official-site-new",
  storageBucket: "money-master-official-site-new.appspot.com",
  messagingSenderId: "580013071708",
  appId: "1:580013071708:web:76363a43638401cda07599",
  measurementId: "G-26CBLGCKC1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables
let coinCount = 0;
let firstTapDone = false;
let reminderPlayed = false;
let tapTotal = 0;
let tapColorIndex = 0;

const colorStages = ["#ffc107", "#4caf50", "#03a9f4", "#e91e63", "#9c27b0"];

const tapIcon = document.getElementById("tapIcon");
const coinCountDisplay = document.getElementById("coinCount");
const tapSound = document.getElementById("tapSound");
const reminderSound = document.getElementById("reminderSound");
const dashboardIcon = document.getElementById("dashboardIcon");

// Reminder timer (6 mins)
function startReminderTimer() {
  setTimeout(() => {
    if (!reminderPlayed) {
      reminderSound.play().catch(() => {});
      reminderPlayed = true;
    }
  }, 180000);
}

// Floating +1 animation
function createFloatingCoin(x, y) {
  const float = document.createElement("div");
  float.textContent = "+1 $";
  float.style.position = "absolute";
  float.style.left = x + "px";
  float.style.top = y + "px";
  float.style.fontWeight = "bold";
  float.style.color = colorStages[tapColorIndex % colorStages.length];
  float.style.zIndex = 9999;
  float.style.animation = "floatUp 0.9s ease-out forwards";
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 900);
}

// Safe coin update
async function incrementCoin(uid) {
  try {
    await updateDoc(doc(db, "User", uid), {
      coins: increment(1)
    });
  } catch (err) {
    console.error("Failed to increment coins:", err);
  }
}

// Tap logic
function handleTap(event) {
  const uid = window.loggedUID;
  if (!uid) return;

  coinCount++;
  tapTotal++;
  coinCountDisplay.textContent = coinCount;

  const withdrawBtn = document.getElementById("withdrawBtn");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "withdraw.html";
    });
  }

  tapIcon.style.transform = "rotate(-20deg)";
  setTimeout(() => {
    tapIcon.style.transform = "rotate(0deg)";
  }, 100);

  tapSound.currentTime = 0;
  tapSound.play().catch(() => {});

  const ripple = document.createElement("span");
  ripple.className = "tap-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  createFloatingCoin(event.clientX, event.clientY);

  if (tapTotal % 20 === 0) tapColorIndex++;

  // Firestore-safe increment
  incrementCoin(uid);
}

// Navigation
function goToDashboard() {
  window.location.href = "dashboard.html";
}

// Main page tap handler
function onTapAnywhere(event) {
  const isAd = event.target.tagName === "IFRAME" || event.target.closest(".ad");
  const isDashboard = event.target.id === "dashboardIcon";
  if (isDashboard) return;
  if (!isAd) {
    handleTap(event);
    if (!firstTapDone) {
      loadAdScript();
      firstTapDone = true;
    }
  }
}

// Lazy load ad
function loadAdScript() {
  const script = document.createElement("script");
  script.src = "https://www.profitableratecpm.com/ibu3q4xj87?key=15bf92f761739f1b94851ca0199f3b33";
  script.async = true;
  document.body.appendChild(script);
}

// Init
function initTapPage() {
  const uid = localStorage.getItem("userUID");
  const pin = localStorage.getItem("userPIN");

  if (!uid || uid.length !== 10 || !pin) {
    alert("Session expired or unauthorized. Please login again.");
    localStorage.clear();
    window.location.href = "index.html";
    return;
  }

  window.loggedUID = uid;
  window.loggedPIN = pin;

  document.body.addEventListener("click", onTapAnywhere);

  if (dashboardIcon) {
    dashboardIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      goToDashboard();
    });
  }

  startReminderTimer();
}

window.initTapPage = initTapPage;
