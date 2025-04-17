// Navigation functions
function goToLogin() {
  window.location.href = 'login.html';
}

function goToRegister() {
  window.location.href = 'register.html';
}

function goToForgot() {
  window.location.href = 'forget.html';
}

function continueAsGuest() {
  sessionStorage.setItem('guest', 'true');
  window.location.href = 'dashboard.html'; // or guest_dashboard.html if separate
}

// Optional: Auto-redirect if already authenticated
window.addEventListener('load', () => {
  import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js')
    .then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = 'dashboard.html';
        }
      });
    });
});

// Floating icon (optional if you add one)
const floatingIcon = document.querySelector('.floating-icon');
if (floatingIcon) {
  setInterval(() => {
    floatingIcon.classList.toggle('pulse');
  }, 1500);
}

// --- Ad Script Placeholder ---
/*
Paste your Monetag ad script below this line:
----------------------------------------------
*/
