<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  // Firebase configuration
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Registration function
  window.registerUser = async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const uid = document.getElementById("uid").value.trim();

    if (!name || !uid) {
      alert("Please fill in both name and ID.");
      return;
    }

    if (uid.length !== 10) {
      alert("User ID must be exactly 10 characters.");
      return;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      alert("This ID is already registered. Try a different one.");
      return;
    }

    try {
      await setDoc(userRef, {
        name: name,
        uid: uid,
        coinBalance: 0,
        registrationTimestamp: serverTimestamp()
      });

      localStorage.setItem("userUID", uid);
      localStorage.setItem("userName", name);

      alert("Account created successfully!");
      window.location.href = "tap.html";
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  };
</script>
