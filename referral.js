// referral.js

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

let userUID = "";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userUID = user.uid;

  // Generate referral code
  const refCode = user.uid.slice(0, 8);
  document.getElementById("refCode").textContent = refCode;

  // Load referral earnings
  try {
    const userRef = doc(db, "users", userUID);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
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
    }
  } catch (err) {
    console.error("Error fetching referral data:", err);
  }
});

window.copyCode = function () {
  const refCode = document.getElementById("refCode").textContent;
  navigator.clipboard.writeText(refCode).then(() => {
    alert("Referral code copied!");
  }).catch(() => {
    alert("Copy failed. Try again.");
  });
};

window.goBack = function () {
  const clickSound = new Audio("assets/sound.mp3");
  clickSound.play();
  window.location.href = "dashboard.html";
};
