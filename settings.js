import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Load Settings
window.loadSettings = async function () {
  const uid = localStorage.getItem("userUID");
  if (!uid) {
    alert("Please login first.");
    window.location.href = "index.html";
    return;
  }

  try {
    const userRef = doc(db, "User", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("User not found.");
      return;
    }

    const data = snap.data();
    document.getElementById("userName").value = data.name || "";
    document.getElementById("userEmail").value = data.email || data.mobile || "";
    document.getElementById("userUpi").value = data.upi || "";
    document.getElementById("notifications").value = data.notifications || "on";
  } catch (err) {
    console.error("Error loading settings:", err);
    alert("Failed to load settings.");
  }
};

// Save Settings
window.saveSettings = async function () {
  const uid = localStorage.getItem("userUID");
  if (!uid) return alert("Unauthorized request.");

  const upi = document.getElementById("userUpi").value.trim();
  const notifications = document.getElementById("notifications").value;

  try {
    const userRef = doc(db, "User", uid);
    await updateDoc(userRef, {
      upi,
      notifications
    });
    alert("Settings updated successfully.");
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save settings.");
  }
};

// Change Name
window.changeName = async function () {
  const uid = localStorage.getItem("userUID");
  const name = document.getElementById("changeName").value.trim();
  if (!uid || !name) return alert("Enter a valid name.");

  try {
    const userRef = doc(db, "User", uid);
    await updateDoc(userRef, { name });
    alert("Name updated successfully.");
    window.loadSettings();
  } catch (err) {
    console.error(err);
    alert("Failed to update name.");
  }
};

// Change Password
window.changePassword = async function () {
  const uid = localStorage.getItem("userUID");
  const pin = document.getElementById("changePassword").value.trim();
  if (!uid || pin.length < 4) return alert("Enter a 4-digit PIN.");

  try {
    const userRef = doc(db, "User", uid);
    await updateDoc(userRef, { pin });
    alert("PIN updated successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to update PIN.");
  }
};

// Change Email
window.changeEmail = async function () {
  const uid = localStorage.getItem("userUID");
  const email = document.getElementById("changeEmail").value.trim();
  if (!uid || !email.includes("@")) return alert("Enter a valid email.");

  try {
    const userRef = doc(db, "User", uid);
    await updateDoc(userRef, { email });
    alert("Email updated successfully.");
    window.loadSettings();
  } catch (err) {
    console.error(err);
    alert("Failed to update email.");
  }
};
