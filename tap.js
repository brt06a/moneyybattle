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

// Reminder timer (6 minutes)
function startReminderTimer() {
  setTimeout(() => {
    if (!reminderPlayed) {
      reminderSound.play().catch(() => {});
      reminderPlayed = true;
    }
  }, 360000);
}

// Create floating coin animation
function createFloatingCoin(x, y) {
  const float = document.createElement("div");
  float.textContent = "+1 BITCOIN";
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

// Coin tap handler
function handleTap(event) {
  coinCount++;
  tapTotal++;
  coinCountDisplay.textContent = coinCount;

  // Animate icon
  tapIcon.style.transform = "rotate(-20deg)";
  setTimeout(() => {
    tapIcon.style.transform = "rotate(0deg)";
  }, 100);

  // Play sound
  tapSound.currentTime = 0;
  tapSound.play().catch(() => {});

  // Ripple effect
  const ripple = document.createElement("span");
  ripple.className = "tap-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // Floating coin
  createFloatingCoin(event.clientX, event.clientY);

  // Change color every 20 taps
  if (tapTotal % 20 === 0) tapColorIndex++;
}

// Navigate to dashboard
function goToDashboard() {
  window.location.href = "dashboard.html";
}

// Tap handler (excluding dashboard and ads)
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

// Main init
function initTapPage() {
  const uid = localStorage.getItem("userUID");
  const pin = localStorage.getItem("userPIN");

  if (!uid || uid.length !== 10 || !pin) {
    alert("Session expired or unauthorized. Please login again.");
    localStorage.clear();
    window.location.href = "index.html";
    return;
  }

  // Optionally: Store session globally
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
