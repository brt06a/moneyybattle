import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
  authDomain: "money-master-official-site-new.firebaseapp.com",
  databaseURL: "https://money-master-official-site-new-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-master-official-site-new",
  storageBucket: "money-master-official-site-new.appspot.com",
  messagingSenderId: "580013071708",
  appId: "1:580013071708:web:76363a43638401cda07599",
  measurementId: "G-26CBLGCKC1"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Main login function
window.loginUser = function (e) {
  e.preventDefault();

  const input = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!input || !password) {
    alert("Please fill all fields.");
    return;
  }

  const isEmail = input.includes("@");
  const isMobile = /^[6-9]\d{9}$/.test(input);

  if (!isEmail && !isMobile) {
    alert("Enter a valid email or 10-digit mobile number.");
    return;
  }

  const loginWithCredentials = (email) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        const uid = userCred.user.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("userUID", uid);
          localStorage.setItem("userName", userData.fullName || "");
          localStorage.setItem("mode", "login");

          console.log("Login Success:");
          console.log("userUID:", localStorage.getItem("userUID"));
          console.log("userName:", localStorage.getItem("userName"));
          console.log("mode:", localStorage.getItem("mode"));

          alert("Login successful!");
          setTimeout(() => {
            window.location.href = "tap.html";
          }, 300); // small delay ensures localStorage is ready
        } else {
          alert("No user data found.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login failed. Check credentials.");
      });
  };

  if (isEmail) {
    loginWithCredentials(input);
  } else {
    const fakeEmail = `${input}@moneymaster.com`;
    loginWithCredentials(fakeEmail);
  }
};
