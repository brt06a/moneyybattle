import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.registerUser = async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const uid = document.getElementById("uid").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const confirm = document.getElementById("confirm").value.trim();

  if (!name || !uid || !pin || !confirm) {
    alert("Please fill all fields.");
    return;
  }

  if (uid.length !== 10 || !/^[a-zA-Z0-9]+$/.test(uid)) {
    alert("UID must be 10 characters (letters and numbers only).");
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    alert("PIN must be exactly 4 digits.");
    return;
  }

  if (pin !== confirm) {
    alert("PINs do not match.");
    return;
  }

  try {
    const docRef = doc(db, "User", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      alert("UID already taken. Choose a different one.");
      return;
    }

    const userData = {
      name: name,
      uid: uid,
      pin: pin,
      coinBalance: 0,
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, userData);

    // Save to localStorage for session
    localStorage.setItem("userUID", uid);
    localStorage.setItem("userName", name);
    localStorage.setItem("mode", "login");

    // Show copy section
    document.getElementById("generatedUID").textContent = uid;
    document.getElementById("copyBox").style.display = "block";

    setTimeout(() => {
      alert("Account created successfully!");
      window.location.href = "tap.html";
    }, 1500);
  } catch (err) {
    console.error("Registration error:", err);
    alert("Failed to create account. Try again.");
  }
};
