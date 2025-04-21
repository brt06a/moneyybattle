import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
  authDomain: "money-master-official-site-new.firebaseapp.com",
  projectId: "money-master-official-site-new",
  storageBucket: "money-master-official-site-new.appspot.com",
  messagingSenderId: "580013071708",
  appId: "1:580013071708:web:76363a43638401cda07599",
  measurementId: "G-26CBLGCKC1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility to generate UID
function generateUID(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Toggle mode: login or register
let mode = "register"; // or "login"

window.toggleMode = function (selected) {
  mode = selected;
  document.getElementById("modeTitle").textContent = selected === "register" ? "Create Account" : "Login";
  document.getElementById("nameGroup").style.display = selected === "register" ? "block" : "none";
  document.getElementById("toggle-register").classList.toggle("active", selected === "register");
  document.getElementById("toggle-login").classList.toggle("active", selected === "login");
  document.getElementById("submitBtn").textContent = selected === "register" ? "Create Account" : "Login";
};

window.handleSubmit = async function (e) {
  e.preventDefault();

  const name = document.getElementById("name")?.value?.trim();
  const uid = document.getElementById("uid").value.trim();
  const pin = document.getElementById("pin").value.trim();

  if (!uid || !pin) {
    alert("Please enter UID and PIN.");
    return;
  }

  if (mode === "register") {
    if (!name) {
      alert("Name is required.");
      return;
    }

    const userRef = doc(db, "User", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      alert("UID already exists. Choose another.");
      return;
    }

    await setDoc(userRef, {
      name,
      uid,
      pin,
      coins: 0,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem("userUID", uid);
    localStorage.setItem("userName", name);
    localStorage.setItem("mode", "login");

    alert("Account created successfully!");
    window.location.href = "tap.html";
  } else {
    // login mode
    const userRef = doc(db, "User", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("Account not found.");
      return;
    }

    const data = snap.data();
    if (data.pin !== pin) {
      alert("Incorrect PIN.");
      return;
    }

    localStorage.setItem("userUID", uid);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("mode", "login");

    alert("Login successful!");
    window.location.href = "tap.html";
  }
};
