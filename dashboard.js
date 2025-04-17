function initDashboard() {
  const mode = localStorage.getItem("mode");

  if (!mode || mode === "guest") {
    window.location.href = "index.html";
  }
}

// Reusable tap sound
function playClickSound() {
  const audio = new Audio("assets/sound.mp3");
  audio.play().catch(() => {});
}

// Go to another page with sound
function goTo(page) {
  playClickSound();
  setTimeout(() => {
    window.location.href = page;
  }, 200);
}

// Go back to previous page
function goBack() {
  playClickSound();
  setTimeout(() => {
    window.location.href = "tap.html";
  }, 200);
}

// Logout user and redirect to index
function logoutUser() {
  playClickSound();
  localStorage.clear();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 300);
}
