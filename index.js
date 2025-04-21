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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mode toggle logic
let mode = "register";

// Define toggleMode before any potential button click
window.toggleMode = function (selected) {
  mode = selected;
  document.getElementById("modeTitle").textContent = selected === "register" ? "Create Account" : "Login";
  document.getElementById("nameGroup").style.display = selected === "register" ? "block" : "none";
  document.getElementById("toggle-register").classList.toggle("active", selected === "register");
  document.getElementById("toggle-login").classList.toggle("active", selected === "login");
  document.getElementById("submitBtn").textContent = selected === "register" ? "Create Account" : "Login";
};

// Define handler function globally so HTML can find it
window.handleSubmit = async function (e) {
  e.preventDefault();
  if (mode === "register") {
    await window.registerUser();
  } else {
    await window.loginUser();
  }
};

// Register user function
window.registerUser = async function () {
  const name = document.getElementById("name")?.value?.trim();
  const uid = document.getElementById("uid").value.trim();
  const pin = document.getElementById("pin").value.trim();

  if (!name || !uid || !pin) {
    alert("All fields are required for registration.");
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
};

// Login user function
window.loginUser = async function () {
  const uid = document.getElementById("uid").value.trim();
  const pin = document.getElementById("pin").value.trim();

  if (!uid || !pin) {
    alert("Please enter UID and PIN.");
    return;
  }

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
};
