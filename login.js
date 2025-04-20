import {
  getFirestore,
  doc,
  getDoc
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

window.loginUser = async function (e) {
  e.preventDefault();

  const uid = document.getElementById("uid").value.trim();
  const pin = document.getElementById("pin").value.trim();

  if (!uid || !pin) {
    alert("Please enter both UID and PIN.");
    return;
  }

  try {
    const docRef = doc(db, "User", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("No account found with this UID.");
      return;
    }

    const userData = docSnap.data();

    if (userData.pin === pin) {
      localStorage.setItem("userUID", uid);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("mode", "login");

      alert("Login successful!");
      window.location.href = "tap.html";
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Failed to login. Try again.");
  }
};
