import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("userEmail");
const upiInput = document.getElementById("userUpi");
const notifySelect = document.getElementById("notifications");

window.loadSettings = async function () {
  const uid = localStorage.getItem("userUID");
  if (!uid) {
    alert("You are not logged in!");
    window.location.href = "index.html";
    return;
  }

  try {
    const docRef = doc(db, "User", uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      nameInput.value = data.name || "User";
      emailInput.value = data.email || "N/A";
      upiInput.value = data.upi || "";
      notifySelect.value = data.notifications || "on";
    } else {
      alert("User data not found.");
    }
  } catch (err) {
    console.error("Error loading settings:", err);
    alert("Failed to load settings.");
  }
};

window.saveSettings = async function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const uid = localStorage.getItem("userUID");
  if (!uid) return alert("Not logged in.");

  const upi = upiInput.value.trim();
  const notifyPref = notifySelect.value;

  try {
    await updateDoc(doc(db, "User", uid), {
      upi,
      notifications: notifyPref
    });
    alert("Settings saved!");
  } catch (err) {
    console.error("Error saving settings:", err);
    alert("Failed to save settings.");
  }
};

window.changeName = async function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newName = document.getElementById("changeName").value.trim();
  if (!newName) return alert("Please enter a name");

  const uid = localStorage.getItem("userUID");
  if (!uid) return alert("Not logged in.");

  try {
    await updateDoc(doc(db, "User", uid), { name: newName });
    alert("Name updated!");
    nameInput.value = newName;
  } catch (err) {
    console.error("Error updating name:", err);
    alert("Failed to update name.");
  }
};

window.changeEmail = async function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();

  const newEmail = document.getElementById("changeEmail").value.trim();
  if (!newEmail) return alert("Please enter an email");

  const uid = localStorage.getItem("userUID");
  if (!uid) return alert("Not logged in.");

  try {
    await updateDoc(doc(db, "User", uid), { email: newEmail });
    alert("Email updated!");
    emailInput.value = newEmail;
  } catch (err) {
    console.error("Error updating email:", err);
    alert("Failed to update email.");
  }
};

window.changePassword = function () {
  const sound = new Audio("assets/sound.mp3");
  sound.play();
  alert("Password change is not supported with Firestore-only login.");
};
