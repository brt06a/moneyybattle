// register.js (linked in the HTML)

import { getAuth, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, confirm } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Get Firebase auth and firestore instances from the global scope (initialized in HTML)
const auth = window.auth;
const db = window.db;

// Global reCAPTCHA verifier
let recaptchaVerifier = null;

window.onload = function() {
  recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (token) => {
      // Token is available, proceed with registration
      const registrationType = document.querySelector('input[name="type"]:checked').value;
      handleRegistration(registrationType, token);
    },
    'expired-callback': () => {
      console.log("reCAPTCHA expired");
      alert("reCAPTCHA verification expired. Please try again.");
    }
  }, auth);
};

async function registerUser(e, recaptchaToken) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const emailOrMobile = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm').value;
  const referralCode = document.getElementById('referralCode').value;
  const registrationType = document.querySelector('input[name="type"]:checked').value;
  const otp = document.getElementById('otp') ? document.getElementById('otp').value : null;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    let userCredential;
    if (registrationType === 'email') {
      userCredential = await createUserWithEmailAndPassword(auth, emailOrMobile, password);
      await saveUserData(userCredential.user.uid, name, emailOrMobile, null, referralCode);
      alert('Account created successfully!');
      window.location.href = 'index.html'; // Redirect as needed
    } else if (registrationType === 'mobile') {
      if (!window.confirmationResult) {
        alert('Please request OTP first.');
        return;
      }
      const result = await confirm(window.confirmationResult, otp);
      await saveUserData(result.user.uid, name, null, emailOrMobile, referralCode);
      alert('Phone number verified and account created!');
      window.location.href = 'index.html'; // Redirect as needed
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert(`Registration failed: ${error.message}`);
    if (recaptchaVerifier) {
      recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    }
  }
}

async function requestOTP() {
  const mobileNumber = document.getElementById('email').value; // 'email' field is used for mobile in mobile mode
  if (!/^\d{10}$/.test(mobileNumber)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  try {
    window.confirmationResult = await signInWithPhoneNumber(auth, '+91' + mobileNumber, recaptchaVerifier);
    document.getElementById('otpBox').innerHTML = '<input type="text" id="otp" placeholder="Enter OTP" required>';
    document.querySelector('button[type="submit"]').textContent = 'VERIFY OTP';
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert(`Error sending OTP: ${error.message}`);
    if (recaptchaVerifier) {
      recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    }
  }
}

async function saveUserData(uid, name, email, mobile, referralCode) {
  try {
    const userData = {
      uid: uid,
      name: name,
      email: email || null,
      mobile: mobile || null,
      coinBalance: 0,
      referralCode: generateUniqueReferralCode(),
      referredBy: null,
      registrationTimestamp: serverTimestamp()
    };

    if (referralCode) {
      // Implement logic to handle referral code (e.g., look up referrer)
      console.log("Referral Code:", referralCode);
      // You would likely use Cloud Functions for secure referral processing
    }

    await setDoc(doc(db, 'users', uid), userData);
    console.log('User data saved to Firestore');
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    alert('Error saving user data.');
  }
}

function generateUniqueReferralCode() {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
  // Implement uniqueness check in a real application
}

function handleCaptcha(e) {
  e.preventDefault();
  const registrationType = document.querySelector('input[name="type"]:checked').value;
  if (registrationType === 'mobile' && !window.confirmationResult) {
    requestOTP();
  } else {
    grecaptcha.enterprise.execute('6LfWNRorAAAAANtRO74W-GG8rmOwqly3ZNOZ5Py1', { action: 'submit' })
      .then(token => {
        registerUser(e, token);
      });
  }
}

function toggleType() {
  const type = document.querySelector('input[name="type"]:checked').value;
  const input = document.getElementById("email");
  input.placeholder = type === "email" ? "Email" : "Mobile Number (10 digits)";

  const submitButton = document.querySelector('button[type="submit"]');
  document.getElementById("otpBox").innerHTML = ""; // Clear OTP box on toggle
  submitButton.textContent = "CREATE ACCOUNT";
  window.confirmationResult = null; // Reset confirmation result on toggle
}

function goBack() {
  const clickSound = new Audio("assets/sound.mp3");
  clickSound.play();
  window.location.href = "index.html";
}
