let coinCount = 0;
let firstTapDone = false;
let reminderPlayed = false;

const tapIcon = document.getElementById("tapIcon");
const coinCountDisplay = document.getElementById("coinCount");
const tapSound = document.getElementById("tapSound");
const reminderSound = document.getElementById("reminderSound");
const dashboardIcon = document.getElementById("dashboardIcon");

// ⏱ Reminder after 6 minutes
function startReminderTimer() {
  setTimeout(() => {
    if (!reminderPlayed) {
      reminderSound.play().catch(() => {});
      reminderPlayed = true;
    }
  }, 360000); // 6 minutes
}

// Coin increment and animation
function handleTap(event) {
  coinCount++;
  coinCountDisplay.textContent = coinCount;

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
}

// Go to dashboard
function goToDashboard() {
  window.location.href = "dashboard.html";
}

// Valid tap logic (excluding dashboard icon / ad iframe)
function onTapAnywhere(event) {
  const isAd = event.target.tagName === "IFRAME" || event.target.closest(".ad");
  const isDashboard = event.target.id === "dashboardIcon";

  if (isDashboard) return; // let its own handler work

  if (!isAd) {
    handleTap(event);
    if (!firstTapDone) {
      loadAdScript();
      firstTapDone = true;
    }
  }
}

// Load ad script after first tap
function loadAdScript() {
  const script = document.createElement("script");
  script.src = "https://www.profitableratecpm.com/ibu3q4xj87?key=15bf92f761739f1b94851ca0199f3b33";
  script.async = true;
  document.body.appendChild(script);
}

// Initialize everything
function initTapPage() {
  document.body.addEventListener("click", onTapAnywhere);

  if (dashboardIcon) {
    dashboardIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      goToDashboard();
    });
  }

  startReminderTimer();
}
function initTapPage() {
  const uid = localStorage.getItem("userUID");

  if (!uid || uid.length !== 10) {
    alert("Session expired or unauthorized. Please login again.");
    localStorage.clear();
    window.location.href = "index.html";
    return;
  }

  // Load user data
  loadInitialCoins();
  // ...rest of your code
}
window.initTapPage = initTapPage;
