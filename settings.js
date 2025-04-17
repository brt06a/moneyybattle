// settings.js
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();
const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("userEmail");
const upiInput = document.getElementById("userUpi");
const notifySelect = document.getElementById("notifications");

onAuthStateChanged(auth, (user) => {
  if (user) {
    nameInput.value = user.displayName || "User";
    emailInput.value = user.email || "N/A";
    upiInput.value = localStorage.getItem("userUpi") || "";
    notifySelect.value = localStorage.getItem("notifications") || "on";
  } else {
    window.location.href = "login.html";
  }
});

window.saveSettings = function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const upi = upiInput.value.trim();
  const notifyPref = notifySelect.value;

  localStorage.setItem("userUpi", upi);
  localStorage.setItem("notifications", notifyPref);

  alert("Settings saved!");
};

window.changeName = function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newName = document.getElementById("changeName").value.trim();
  if (newName === "") return alert("Please enter a name");

  updateProfile(auth.currentUser, {
    displayName: newName
  })
    .then(() => {
      alert("Name updated!");
      nameInput.value = newName;
    })
    .catch((error) => {
      console.error("Name update error:", error);
      alert("Failed to update name.");
    });
};

window.changeEmail = function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newEmail = document.getElementById("changeEmail").value.trim();
  if (newEmail === "") return alert("Please enter an email");

  updateEmail(auth.currentUser, newEmail)
    .then(() => {
      alert("Email updated!");
      emailInput.value = newEmail;
    })
    .catch((error) => {
      console.error("Email update error:", error);
      alert("Failed to update email. Please reauthenticate.");
    });
};

window.changePassword = function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newPass = document.getElementById("changePassword").value.trim();
  if (newPass.length < 6) {
    return alert("Password should be at least 6 characters");
  }

  updatePassword(auth.currentUser, newPass)
    .then(() => {
      alert("Password updated!");
    })
    .catch((error) => {
      console.error("Password update error:", error);
      alert("Failed to update password. Please reauthenticate.");
    });
};
