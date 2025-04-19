import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const auth = getAuth();
const db = window.db;
let confirmationResult;
let isMobile = false;

window.registerUser = function (e, token = null) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const input = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const referral = document.getElementById("referralCode").value.trim();

  const type = document.querySelector('input[name="type"]:checked').value;
  isMobile = type === "mobile";

  if (!name || !input || !password || !confirm) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  if (isMobile) {
    if (!/^[6-9]\d{9}$/.test(input)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    // Mobile OTP
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "otpBox",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha solved");
          },
        },
        auth
      );
    }

    const fullPhone = "+91" + input;
    signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        showOTPBox();
      })
      .catch((err) => {
        console.error("OTP error:", err);
        alert("Failed to send OTP. Try again.");
      });

  } else {
    // Email registration
    if (!input.includes("@") || !input.includes(".")) {
      alert("Enter valid email address");
      return;
    }

    createUserWithEmailAndPassword(auth, input, password)
      .then((userCred) => {
        return updateProfile(userCred.user, { displayName: name }).then(() => {
          const uid = userCred.user.uid;

          // Save to DB
          set(ref(db, "users/" + uid), {
            name: name,
            email: input,
            phone: null,
            coins: 0,
            referral: referral || null,
            referredBy: referral || null,
          });

          handleReferralBonus(uid, referral);

          localStorage.setItem("userUID", uid);
          localStorage.setItem("userName", name);
          localStorage.setItem("mode", "login");

          alert("Account created successfully!");
          window.location.href = "tap.html";
        });
      })
      .catch((error) => {
        console.error("Register error:", error);
        alert("Failed to register. Try again.");
      });
  }
};

function showOTPBox() {
  document.getElementById("otpBox").innerHTML = `
    <input type="text" id="otpCode" placeholder="Enter OTP">
    <button onclick="verifyOTP()">Verify OTP</button>
  `;
}

window.verifyOTP = function () {
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("email").value.trim();
  const referral = document.getElementById("referralCode").value.trim();
  const code = document.getElementById("otpCode").value.trim();

  if (!code) {
    alert("Enter OTP");
    return;
  }

  confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      return updateProfile(user, { displayName: name }).then(() => {
        const uid = user.uid;

        set(ref(db, "users/" + uid), {
          name: name,
          email: null,
          phone: "+91" + mobile,
          coins: 0,
          referral: referral || null,
          referredBy: referral || null,
        });

        handleReferralBonus(uid, referral);

        localStorage.setItem("userUID", uid);
        localStorage.setItem("userName", name);
        localStorage.setItem("mode", "login");

        alert("Mobile account created successfully!");
        window.location.href = "tap.html";
      });
    })
    .catch((err) => {
      console.error("OTP verify error:", err);
      alert("Invalid OTP. Please try again.");
    });
};

function handleReferralBonus(userId, refCode) {
  if (!refCode) return;

  const dbRef = ref(db);
  get(child(dbRef, "users"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let matchedUser = null;

        snapshot.forEach((childSnap) => {
          if (childSnap.key.startsWith(refCode)) {
            matchedUser = childSnap;
          }
        });

        if (matchedUser) {
          const refUID = matchedUser.key;
          const currentCoins = matchedUser.val().coins || 0;
          const newCoins = currentCoins + 10000;

          update(ref(db, "users/" + refUID), {
            coins: newCoins,
          });
        }
      }
    })
    .catch((err) => console.error("Referral lookup error:", err));
}
