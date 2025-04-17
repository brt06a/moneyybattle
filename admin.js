import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDo6BwWCRTexL_-lUwgy41FYB3zpJKRiWU",
  authDomain: "money-master-89c02.firebaseapp.com",
  projectId: "money-master-89c02",
  storageBucket: "money-master-89c02.appspot.com",
  messagingSenderId: "226410161274",
  appId: "1:226410161274:web:62793ff8d39e0d642707c3",
  measurementId: "G-62K0SFSZK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Protect Admin Page
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "admin@example.com") {
    alert("Unauthorized access. Only admin can view this page.");
    window.location.href = "index.html";
  }
});

// Init Function
window.initAdminPanel = async function () {
  await loadPendingWithdrawals();
  await loadAllUsers();
};

// Load Withdraw Requests
async function loadPendingWithdrawals() {
  const withdrawList = document.getElementById("withdrawList");
  withdrawList.innerHTML = "<p>Loading...</p>";

  const q = query(collection(db, "withdrawals"), where("status", "==", "pending"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    withdrawList.innerHTML = "<p>No pending withdrawals.</p>";
    return;
  }

  const list = document.createElement("div");
  list.className = "data-list";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <p><strong>User:</strong> ${data.userEmail || "N/A"}</p>
      <p><strong>Method:</strong> ${data.method || "N/A"}</p>
      <p><strong>Amount:</strong> ₹${data.amount}</p>
      <p><strong>Details:</strong> ${data.details}</p>
      <button onclick="approveWithdrawal('${docSnap.id}')">Approve</button>
    `;
    list.appendChild(div);
  });

  withdrawList.innerHTML = "";
  withdrawList.appendChild(list);
}

// Approve Withdraw
window.approveWithdrawal = async function (docId) {
  const ref = doc(db, "withdrawals", docId);
  await updateDoc(ref, { status: "approved" });
  alert("Withdrawal approved.");
  loadPendingWithdrawals(); // Refresh
};

// Load All Users
async function loadAllUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "<p>Loading...</p>";

  const snapshot = await getDocs(collection(db, "users"));

  if (snapshot.empty) {
    userList.innerHTML = "<p>No users found.</p>";
    return;
  }

  const list = document.createElement("div");
  list.className = "data-list";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <p><strong>Name:</strong> ${data.name || "N/A"}</p>
      <p><strong>Email:</strong> ${data.email || "N/A"}</p>
      <p><strong>Coins:</strong> ${data.coins || 0}</p>
    `;
    list.appendChild(div);
  });

  userList.innerHTML = "";
  userList.appendChild(list);
}
