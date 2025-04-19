import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const emailOrPhone = document.getElementById("emailOrPhone").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();
  const referral = document.getElementById("referralCode").value.trim();

  if (!name || !emailOrPhone || !password || !confirm) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  const isEmail = emailOrPhone.includes("@") && emailOrPhone.includes(".");
  const isPhone = /^[6-9]\d{9}$/.test(emailOrPhone);

  if (!isEmail && !isPhone) {
    alert("Enter a valid email or 10-digit mobile number.");
    return;
  }

  // Daily registration limit check
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-04-19"
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("date", "==", today));
  const snapshot = await getDocs(q);

  let alreadyRegistered = false;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (
      (data.email && data.email === emailOrPhone) ||
      (data.mobile && data.mobile === emailOrPhone)
    ) {
      alreadyRegistered = true;
    }
  });

  if (alreadyRegistered) {
    alert("You have already registered today with this email or mobile.");
    return;
  }

  try {
    // Register using email (Firebase Auth required only for email)
    let userId;
    if (isEmail) {
      const userCred = await createUserWithEmailAndPassword(auth, emailOrPhone, password);
      await updateProfile(userCred.user, { displayName: name });
      userId = userCred.user.uid;
    } else {
      // For mobile, just generate UID manually (not using Auth)
      userId = "mob_" + Date.now();
    }

    const userData = {
      uid: userId,
      name,
      email: isEmail ? emailOrPhone : null,
      mobile: isPhone ? emailOrPhone : null,
      referredBy: referral || null,
      coins: 0,
      date: today,
      registeredAt: serverTimestamp()
    };

    await setDoc(doc(db, "users", userId), userData);

    alert("Registration successful!");
    window.location.href = "tap.html";
  } catch (err) {
    console.error(err);
    alert("Registration failed: " + err.message);
  }
});
