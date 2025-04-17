// register.js

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();

let verificationId = null;
let isOTPVisible = false;

window.registerUser = function (e) {
  e.preventDefault();

  const clickSound = new Audio("assets/sound.mp3");
  clickSound.play();

  const name = document.getElementById("name").value.trim();
  const emailOrPhone = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!name || !emailOrPhone || !password || !confirm) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  const isPhone = /^[6-9]\d{9}$/.test(emailOrPhone);
  const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);

  if (!isPhone && !isEmail) {
    alert("Enter a valid mobile number or email.");
    return;
  }

  grecaptcha.enterprise.ready(() => {
    grecaptcha.enterprise.execute("6LfWNRorAAAAANtRO74W-GG8rmOwqly3ZNOZ5Py1", { action: "register" }).then(() => {
      if (isEmail) {
        // Email registration
        createUserWithEmailAndPassword(auth, emailOrPhone, password)
          .then((userCred) => {
            return updateProfile(userCred.user, { displayName: name });
          })
          .then(() => {
            localStorage.setItem("mode", "login");
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", emailOrPhone);
            localStorage.setItem("userUID", auth.currentUser.uid);
            alert("Account created!");
            window.location.href = "tap.html";
          })
          .catch((err) => {
            console.error("Email signup error:", err);
            alert("Signup failed. Try again.");
          });
      } else {
        // Mobile registration
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'otpBox', {
            size: 'invisible',
            callback: () => {
              console.log("Recaptcha passed");
            }
          });
        }

        const fullPhone = "+91" + emailOrPhone;
        signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
          .then((confirmationResult) => {
            verificationId = confirmationResult;
            showOTPBox();
          })
          .catch((err) => {
            console.error("OTP error:", err);
            alert("OTP could not be sent.");
          });
      }
    });
  });
};

function showOTPBox() {
  const otpBox = document.getElementById("otpBox");
  if (!isOTPVisible) {
    otpBox.innerHTML = `
      <input type="text" id="otpCode" placeholder="Enter OTP" />
      <button onclick="verifyOTP()">Verify</button>
    `;
    isOTPVisible = true;
  }
}

window.verifyOTP = function () {
  const name = document.getElementById("name").value.trim();
  const code = document.getElementById("otpCode").value.trim();

  if (!code) {
    alert("Enter OTP code.");
    return;
  }

  verificationId.confirm(code)
    .then((result) => {
      const user = result.user;
      return updateProfile(user, { displayName: name }).then(() => {
        localStorage.setItem("mode", "login");
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", user.phoneNumber);
        localStorage.setItem("userUID", user.uid);
        alert("Phone account created!");
        window.location.href = "tap.html";
      });
    })
    .catch((error) => {
      console.error("OTP verification failed:", error);
      alert("Invalid OTP.");
    });
};
