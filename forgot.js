// forget.js
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();

window.resetPassword = function (event) {
  event.preventDefault();
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const input = document.getElementById("userInput").value.trim();

  if (!input) {
    alert("Please enter your registered Email or Mobile number.");
    return;
  }

  // Check for email format
  if (input.includes("@")) {
    sendPasswordResetEmail(auth, input)
      .then(() => {
        alert("Password reset email sent successfully!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert("Unable to send password reset email. Check your email.");
      });

  } else if (/^\d{10}$/.test(input)) {
    // Treat as mobile number
    renderCaptcha();

    const fullPhone = "+91" + input;

    signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
      .then((confirmationResult) => {
        const otp = prompt("Enter the OTP sent to your phone:");
        if (otp) {
          confirmationResult.confirm(otp).then((result) => {
            alert("Mobile verification successful! Please go to Settings > Change Password to reset your password.");
            window.location.href = "dashboard.html";
          }).catch(() => {
            alert("Incorrect OTP. Try again.");
          });
        }
      })
      .catch((error) => {
        console.error("SMS error:", error.message);
        alert("Could not send OTP. Check your mobile number.");
      });

  } else {
    alert("Please enter a valid email or 10-digit mobile number.");
  }
};

function renderCaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log("reCAPTCHA verified:", response);
      }
    }, auth);
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }
}

window.goBack = function () {
  const s = new Audio("assets/sound.mp3");
  s.play();
  window.location.href = "index.html";
};
