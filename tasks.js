// Import Firebase dependencies
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const auth = getAuth();
const db = getDatabase();

let currentUser;
let userUID = null;
let adViews = 0;
let totalCoins = 0;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    userUID = user.uid;
    initUserData();
  } else {
    window.location.href = "index.html";
  }
});

function initUserData() {
  const userRef = ref(db, `users/${userUID}`);

  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      adViews = data.adViews || 0;
      totalCoins = data.coins || 0;
      document.getElementById("coinDisplay").textContent = totalCoins;
    }
  });
}

// Handle ad watching
window.watchAdAndReward = async function () {
  const rewardCoins = 500;
  const newCoins = totalCoins + rewardCoins;
  const newAdViews = adViews + 1;

  // Update in DB
  const updates = {
    coins: newCoins,
    adViews: newAdViews
  };

  // Check for referral bonus eligibility
  const userRef = ref(db, `users/${userUID}`);
  const userSnap = await get(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.val();
    const referredBy = userData.referredBy;

    if (referredBy && !userData.refBonusGiven && newAdViews >= 5) {
      const refBonus = 10000;

      // Add bonus to referrer
      const refUserRef = ref(db, `users/${referredBy}`);
      const refUserSnap = await get(refUserRef);

      if (refUserSnap.exists()) {
        const refCoins = refUserSnap.val().coins || 0;
        await update(refUserRef, {
          coins: refCoins + refBonus
        });

        updates.refBonusGiven = true; // Mark as rewarded
      }
    }
  }

  await update(userRef, updates);
  totalCoins = newCoins;
  adViews = newAdViews;
  document.getElementById("coinDisplay").textContent = newCoins;

  alert(`You earned ${rewardCoins} coins!`);
};
