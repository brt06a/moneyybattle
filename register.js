import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();
let confirmationResult = null;
let isPhone = false;

// Toggle between email/phone input
window.toggleInputType = function (type) {
  isPhone = (type === "phone");
  const emailInput = document.getElementById("email");
  emailInput.placeholder = isPhone ? "Enter Mobile (10 digits)" : "Enter Email";
  emailInput.type = isPhone ? "tel" : "email";
  emailInput.value = "";
  document.getElementById("otpBox").innerHTML = "";
};

window.registerUser = function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const refCode = document.getElementById("referralCode").value.trim();

  if (!name || !contact || !password || !confirm) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (isPhone) {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(contact)) {
      alert("Enter valid 10-digit mobile number.");
      return;
    }

    const fullPhone = "+91" + contact;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "registerBtn", {
        size: "invisible",
        callback: (response) => console.log("reCAPTCHA solved"),
      });
    }

    signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        showOTPBox();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to send OTP. Try again.");
      });
  } else {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(contact)) {
      alert("Enter valid email address.");
      return;
    }

    createUserWithEmailAndPassword(auth, contact, password)
      .then((userCred) => {
        return updateProfile(userCred.user, { displayName: name });
      })
      .then(() => {
        storeUserData(name, contact, refCode);
        alert("Account created successfully!");
        window.location.href = "tap.html";
      })
      .catch((err) => {
        console.error(err);
        alert("Registration failed.");
      });
  }
};

// Required imports at the top if not already present
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Inside registerUser function (after user creation is successful)
const db = getDatabase();
const uid = user.uid;
const referralCode = document.getElementById("referralCode")?.value.trim() || null;

await set(ref(db, 'users/' + uid), {
  name: name,
  email: user.email || user.phoneNumber,
  coin: 0,
  adViews: 0,
  refBonusGiven: false,
  referredBy: referralCode || null
});

function showOTPBox() {
  document.getElementById("otpBox").innerHTML = `
    <input type="text" id="otp" placeholder="Enter OTP" />
    <button onclick="verifyOTP()">Verify OTP</button>
  `;
}

window.verifyOTP = function () {
  const code = document.getElementById("otp").value.trim();
  const name = document.getElementById("name").value.trim();
  const refCode = document.getElementById("referralCode").value.trim();

  if (!code) {
    alert("Please enter OTP");
    return;
  }

  confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      updateProfile(user, { displayName: name }).then(() => {
        storeUserData(name, user.phoneNumber, refCode);
        alert("Account created via mobile!");
        window.location.href = "tap.html";
      });
    })
    .catch((err) => {
      console.error(err);
      alert("Incorrect OTP.");
    });
};

function storeUserData(name, emailOrPhone, refCode) {
  localStorage.setItem("mode", "login");
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", emailOrPhone);
  localStorage.setItem("userUID", auth.currentUser.uid);
  if (refCode) {
    localStorage.setItem("refBy", refCode);
  }
}
