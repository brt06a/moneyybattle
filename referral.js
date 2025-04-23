// referral.js

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

let userUID = localStorage.getItem("userUID");

if (!userUID || userUID.length !== 10) { alert("Unauthorized. Please login."); window.location.href = "index.html"; } else { initReferral(); }

async function initReferral() { const refCode = userUID.padStart(15, "0"); document.getElementById("refCode").textContent = refCode;

try { const userRef = doc(db, "User", userUID); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
  document.getElementById("refEarnings").textContent = "0";
  document.getElementById("refCount").textContent = "0";
  document.getElementById("refList").innerHTML = "<li>No referrals yet.</li>";
  return;
}

const data = userSnap.data();
const earnings = data.referralEarnings || 0;
const refUsers = data.referredUsers || [];

document.getElementById("refEarnings").textContent = earnings;
document.getElementById("refCount").textContent = refUsers.length;

const list = document.getElementById("refList");
list.innerHTML = "";

if (refUsers.length === 0) {
  list.innerHTML = "<li>No referrals yet.</li>";
} else {
  refUsers.forEach((uid, i) => {
    const item = document.createElement("li");
    item.textContent = `${i + 1}. ${uid}`;
    list.appendChild(item);
  });
}

} catch (err) { console.error("Error fetching referral data:", err); alert("Failed to load referral info."); } }

window.copyCode = function () { const refCode = document.getElementById("refCode").textContent; navigator.clipboard.writeText(refCode).then(() => { alert("Referral code copied!"); }).catch(() => { alert("Copy failed. Try again."); }); };

window.goBack = function () { const clickSound = new Audio("assets/sound.mp3"); clickSound.play(); setTimeout(() => { window.location.href = "dashboard.html"; }, 200); };

