import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
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

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load wallet balance and update UI
window.loadWithdrawPage = async function () {
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
      alert("User data not found.");
      return;
    }

    const coins = snap.data().coins || 0;
    const inrValue = (coins / 1000).toFixed(2);

    document.getElementById("coinDisplay").textContent = coins;
    document.getElementById("inrValue").textContent = "₹" + inrValue;

    // Check eligibility
    const confirmBtn = document.getElementById("confirmBtn");
    if (coins >= 200000) {
      confirmBtn.classList.add("enabled");
      confirmBtn.disabled = false;
    } else {
      confirmBtn.classList.remove("enabled");
      confirmBtn.disabled = true;
    }
  } catch (err) {
    console.error("Error loading withdraw data:", err);
    alert("Failed to load user data.");
  }
};

// Show selected payment form
window.showForm = function (method) {
  document.getElementById("upiForm").style.display = "none";
  document.getElementById("bankForm").style.display = "none";
  document.getElementById("paypalForm").style.display = "none";

  if (method === "upi") {
    document.getElementById("upiForm").style.display = "block";
  } else if (method === "bank") {
    document.getElementById("bankForm").style.display = "block";
  } else if (method === "paypal") {
    document.getElementById("paypalForm").style.display = "block";
  }
};

// Handle withdrawal submission
window.submitWithdraw = function () {
  const method = document.querySelector('input[name="method"]:checked')?.value;

  if (!method) {
    alert("Please select a payment method.");
    return;
  }

  const snd = new Audio("assets/sound.mp3");
  snd.play();

  let details = {};

  if (method === "upi") {
    const upiID = document.getElementById("upiID").value.trim();
    const upiAmt = document.getElementById("upiAmount").value.trim();
    if (!upiID || !upiAmt) return alert("Please fill all UPI fields.");
    details = { method, upiID, amount: upiAmt };
  }

  if (method === "bank") {
    const name = document.getElementById("bankName").value.trim();
    const ifsc = document.getElementById("bankIFSC").value.trim();
    const acc = document.getElementById("bankAcc").value.trim();
    const amt = document.getElementById("bankAmount").value.trim();
    if (!name || !ifsc || !acc || !amt) return alert("Please fill all Bank fields.");
    details = { method, name, ifsc, acc, amount: amt };
  }

  if (method === "paypal") {
    const payEmail = document.getElementById("paypalEmail").value.trim();
    const payAmt = document.getElementById("paypalAmount").value.trim();
    if (!payEmail || !payAmt) return alert("Please fill all PayPal fields.");
    details = { method, email: payEmail, amount: payAmt };
  }

  console.log("Withdraw Request:", details);
  alert("Withdraw request submitted successfully!");
};
