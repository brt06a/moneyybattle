// index.js

function goToLogin() {
  playClickSound(() => {
    window.location.href = "login.html";
  });
}

function continueAsGuest() {
  playClickSound(() => {
    localStorage.setItem("mode", "guest");
    window.location.href = "tap.html";
  });
}

function goToRegister() {
  playClickSound(() => {
    window.location.href = "register.html";
  });
}

function goToForgot() {
  playClickSound(() => {
    window.location.href = "forgot.html";
  });
}

function playClickSound(callback) {
  const sound = new Audio("assets/sound.mp3");

  sound.play()
    .then(() => {
      // Delay to let click sound play before redirect
      setTimeout(() => {
        if (typeof callback === "function") callback();
      }, 100);
    })
    .catch((e) => {
      console.warn("Sound error:", e);
      if (typeof callback === "function") callback();
    });
}
