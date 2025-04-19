// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
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

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Toggle email/mobile view
const emailBtn = document.getElementById("emailBtn");
const mobileBtn = document.getElementById("mobileBtn");
const emailField = document.getElementById("emailField");
const mobileField = document.getElementById("mobileField");

emailBtn.onclick = () => {
  emailField.style.display = "block";
  mobileField.style.display = "none";
  emailBtn.classList.add("toggle-email");
  mobileBtn.classList.remove("toggle-email");
};

mobileBtn.onclick = () => {
  emailField.style.display = "none";
  mobileField.style.display = "block";
  mobileBtn.classList.add("toggle-email");
  emailBtn.classList.remove("toggle-email");
};

// Create Account
document.getElementById("createAccountBtn").addEventListener("click", async () => {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const isEmailMode = emailField.style.display === "block";

  if (!name || (isEmailMode && !email) || (!isEmailMode && !mobile) || !password || password !== confirmPassword) {
    alert("Please fill all fields correctly.");
    return;
  }

  const identifier = isEmailMode ? email : mobile;
  const today = new Date().toISOString().split("T")[0];

  // Check if already registered today
  const ref = doc(db, "registrations", identifier);
  const snapshot = await getDoc(ref);

  if (snapshot.exists() && snapshot.data().date === today) {
    alert("You have already registered today.");
    return;
  }

  try {
    const userCred = isEmailMode
      ? await createUserWithEmailAndPassword(auth, email, password)
      : { user: { uid: "mobile-" + mobile } }; // For mobile, simulate user object

    const userData = {
      uid: userCred.user.uid,
      name,
      email: isEmailMode ? email : null,
      mobile: isEmailMode ? null : mobile,
      registeredAt: new Date().toISOString(),
      date: today
    };

    await setDoc(doc(db, "registrations", identifier), userData);

    // Real-time listener
    onSnapshot(doc(db, "registrations", identifier), (docSnap) => {
      console.log("Realtime update:", docSnap.data());
    });

    // Redirect
    window.location.href = "tap.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});
