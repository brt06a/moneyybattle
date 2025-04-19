// register.js

import { getAuth, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const auth = getAuth();
const db = window.db;

let confirmationResult = null;

document.getElementById("registerForm").addEventListener("submit", handleCaptcha);

function registerUser(event, token) {
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const referral = document.getElementById("referralCode").value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (type === "email") {
    createUserWithEmailAndPassword(auth, contact, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        saveUserData(uid, name, contact, referral);
        alert("Account created successfully!");
        location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  } else {
    sendOTP(contact);
  }
}

function sendOTP(mobile) {
  const phoneNumber = "+91" + mobile;
  const appVerifier = new RecaptchaVerifier("otpBox", { size: "invisible" }, auth);

  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((result) => {
      confirmationResult = result;
      showOTPInput();
    })
    .catch((error) => {
      alert("OTP Failed: " + error.message);
    });
}

function showOTPInput() {
  document.getElementById("otpBox").innerHTML = `
    <input type="text" id="otp" placeholder="Enter OTP" required />
    <button onclick="verifyOTP()">Verify OTP</button>
  `;
}

window.verifyOTP = function () {
  const otp = document.getElementById("otp").value.trim();
  if (!otp || !confirmationResult) return alert("Invalid OTP or no OTP sent.");

  confirmationResult.confirm(otp)
    .then((result) => {
      const user = result.user;
      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("email").value.trim();
      const referral = document.getElementById("referralCode").value.trim();
      saveUserData(user.uid, name, contact, referral);
      alert("Account created successfully!");
      location.href = "index.html";
    })
    .catch(() => alert("Invalid OTP."));
};

function saveUserData(uid, name, contact, referral) {
  set(ref(db, "users/" + uid), {
    name,
    contact,
    referral
  });
}
