// Navigation functions for buttons
function goToLogin() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

function continueAsGuest() {
  // Optional: You can store guest flag in localStorage or Firebase Anonymous auth
  localStorage.setItem("isGuest", "true");
  window.location.href = "dashboard.html";
}

function goToForgot() {
  window.location.href = "forget.html";
}
