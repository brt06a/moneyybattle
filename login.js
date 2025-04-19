import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();

window.handleLogin = function (event) {
  event.preventDefault();
  playClickSound();

  const emailOrMobile = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Email/Password Login
  if (emailOrMobile.includes("@")) {
    if (!password) return alert("Enter your password");

    signInWithEmailAndPassword(auth, emailOrMobile, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("mode", "login");
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userUID", user.uid);
        localStorage.setItem("userName", user.displayName || "User");
        alert("Login successful!");
        window.location.href = "tap.html";
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed. Check credentials.");
      });
  } else {
    // Mobile Login
    const mobile = emailOrMobile;
    if (!mobile.match(/^[0-9]{10}$/)) {
      return alert("Enter valid 10-digit mobile number");
    }

    grecaptcha.enterprise.ready(() => {
      grecaptcha.enterprise.execute("6LeFqjUpAAAAAIzY-55jSl_z4_mI_l4q91_VvS", { action: "login" })
        .then((token) => {
          sendOTP("+91" + mobile);
        });
    });
  }
};

function sendOTP(mobileNumber) {
  playClickSound();

  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA passed:", response);
      }
    },
    auth
  );

  signInWithPhoneNumber(auth, mobileNumber, window.recaptchaVerifier) // Use window.recaptchaVerifier
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      document.querySelector(".login-form").style.display = "none";

      // Show OTP input box
      document.getElementById("otpBox").style.display = "block";
    })
    .catch((error) => {
      console.error("OTP error:", error);
      alert("Failed to send OTP");
    });
}

window.verifyOTP = function () {
  playClickSound();
  const otp = document.getElementById("otpCode").value;
  if (!otp) return alert("Enter OTP");

  if (window.confirmationResult) { // Check if confirmationResult exists
    window.confirmationResult.confirm(otp)
      .then((result) => {
        const user = result.user;
        localStorage.setItem("mode", "login");
        localStorage.setItem("userUID", user.uid);
        localStorage.setItem("userName", user.displayName || "MobileUser");
        localStorage.setItem("userPhone", user.phoneNumber);
        alert("Login via OTP successful!");
        window.location.href = "tap.html";
      })
      .catch((error) => {
        console.error("OTP verification failed:", error);
        alert("Invalid OTP. Try again.");
      });
  } else {
    alert("No OTP confirmation in progress. Please request OTP again.");
  }
};

function playClickSound() {
  const clickSound = new Audio("assets/sound.mp3");
  clickSound.play().catch((e) => console.warn("Sound error:", e));
}
