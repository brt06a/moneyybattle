import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
  authDomain: "money-master-official-site-new.firebaseapp.com",
  databaseURL: "https://money-master-official-site-new-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-master-official-site-new",
  storageBucket: "money-master-official-site-new.firebasestorage.app",
  messagingSenderId: "580013071708",
  appId: "1:580013071708:web:76363a43638401cda07599",
  measurementId: "G-26CBLGCKC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("userEmail");
const upiInput = document.getElementById("userUpi");
const notifySelect = document.getElementById("notifications");

// Load settings from Firestore
window.loadSettings = async function () {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    alert("You are not logged in!");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    nameInput.value = data.name || "User";
    emailInput.value = data.email || "N/A";
    upiInput.value = data.upi || "";
    notifySelect.value = data.notifications || "on";
  } else {
    alert("User data not found.");
  }
};

// Save UPI and notifications to Firestore
window.saveSettings = async function () {
  const uid = localStorage.getItem("uid");
  if (!uid) return alert("Not logged in");

  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const upi = upiInput.value.trim();
  const notify = notifySelect.value;

  try {
    await updateDoc(doc(db, "users", uid), {
      upi: upi,
      notifications: notify
    });
    alert("Settings saved!");
  } catch (error) {
    console.error("Save failed:", error);
    alert("Failed to save settings.");
  }
};

// Change name
window.changeName = async function () {
  const uid = localStorage.getItem("uid");
  if (!uid) return alert("Not logged in");

  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newName = document.getElementById("changeName").value.trim();
  if (!newName) return alert("Please enter a name");

  try {
    await updateDoc(doc(db, "users", uid), { name: newName });
    alert("Name updated!");
    nameInput.value = newName;
  } catch (error) {
    console.error("Name update failed:", error);
    alert("Failed to update name.");
  }
};

// Change email
window.changeEmail = async function () {
  const uid = localStorage.getItem("uid");
  if (!uid) return alert("Not logged in");

  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newEmail = document.getElementById("changeEmail").value.trim();
  if (!newEmail) return alert("Please enter an email");

  try {
    await updateDoc(doc(db, "users", uid), { email: newEmail });
    alert("Email updated!");
    emailInput.value = newEmail;
  } catch (error) {
    console.error("Email update failed:", error);
    alert("Failed to update email.");
  }
};

// Change password (PIN)
window.changePassword = async function () {
  const uid = localStorage.getItem("uid");
  if (!uid) return alert("Not logged in");

  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newPass = document.getElementById("changePassword").value.trim();
  if (newPass.length < 4) {
    return alert("PIN should be at least 4 digits");
  }

  try {
    await updateDoc(doc(db, "users", uid), { pin: newPass });
    alert("PIN updated!");
  } catch (error) {
    console.error("PIN update failed:", error);
    alert("Failed to update PIN.");
  }
};
