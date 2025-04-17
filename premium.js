// premium.js

// Optional: preload sound for smoother experience
const sound = new Audio("assets/sound.mp3");
sound.preload = "auto";

// Function to handle back navigation
window.goBack = function () {
  sound.play();
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 200); // Short delay for sound to play
};

// You can extend this file later when premium logic (upgrade/payment) is implemented.
