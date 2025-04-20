// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// Register user
async function registerUser(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const uid = document.getElementById("uid").value.trim();

  if (!uid || uid.length !== 10 || !name) {
    alert("Please enter a 10-character ID and name.");
    return;
  }

  const userRef = doc(db, "User", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    alert("This ID is already registered. Please try another.");
    return;
  }

  const now = new Date().toISOString();

  try {
    await setDoc(userRef, {
      fullName: name,
      email: "",
      uniqueUid: uid,
      registrationDate: now,
      coinBalance: 0,
      adViewCount: 0,
      taskCompleted: 0
    });

    alert("Account created successfully!");
    window.location.href = "tap.html";
  } catch (err) {
    alert("Error creating account: " + err.message);
    console.error(err);
  }
}

window.registerUser = registerUser;
