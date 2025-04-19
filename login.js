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

  if (isEmail) {
    // Email login
    signInWithEmailAndPassword(auth, input, password)
      .then(async (userCred) => {
        const uid = userCred.user.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("userUID", uid);
          localStorage.setItem("userName", userData.fullName || "");
          localStorage.setItem("mode", "login");
          alert("Login successful!");
          window.location.href = "tap.html";
        } else {
          alert("No user data found.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login failed. Check credentials.");
      });

  } else {
    // Mobile login: generate fake email
    const fakeEmail = `${input}@moneymaster.com`;
    signInWithEmailAndPassword(auth, fakeEmail, password)
      .then(async (userCred) => {
        const uid = userCred.user.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("userUID", uid);
          localStorage.setItem("userName", userData.fullName || "");
          localStorage.setItem("mode", "login");
          alert("Login successful!");
          window.location.href = "tap.html";
        } else {
          alert("No user data found.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login failed. Check credentials.");
      });
  }
};
