// wallet.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load user coin balance and update UI
window.loadWallet = async function () {
  const uid = localStorage.getItem("userUID");
  const coinEl = document.getElementById("coinDisplay");
  const inrEl = document.getElementById("inrValue");

  if (!uid || uid.length !== 10) {
    alert("Unauthorized access. Please login first.");
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
    const coins = data.coins || 0;

    coinEl.textContent = coins;
    inrEl.textContent = (coins / 1000).toFixed(2);
  } catch (err) {
    console.error("Error fetching wallet data:", err);
    alert("Failed to load wallet data.");
  }
};
