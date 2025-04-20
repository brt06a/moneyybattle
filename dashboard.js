<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
    authDomain: "money-master-official-site-new.firebaseapp.com",
    databaseURL: "https://money-master-official-site-new-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "money-master-official-site-new",
    storageBucket: "money-master-official-site-new.appspot.com",
    messagingSenderId: "580013071708",
    appId: "1:580013071708:web:76363a43638401cda07599",
    measurementId: "G-26CBLGCKC1"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // INIT DASHBOARD
  window.initDashboard = async function () {
    const uid = localStorage.getItem("userUID");

    if (!uid || uid.length !== 10) {
      alert("Unauthorized access. Please login first.");
      window.location.href = "index.html";
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("Invalid user. Please login again.");
        localStorage.clear();
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Error verifying session.");
      window.location.href = "index.html";
    }
  };

  // SOUND
  window.playClickSound = function () {
    const audio = new Audio("assets/sound.mp3");
    audio.play().catch(() => {});
  };

  // NAVIGATE
  window.goTo = function (page) {
    playClickSound();
    setTimeout(() => {
      window.location.href = page;
    }, 200);
  };

  // BACK
  window.goBack = function () {
    playClickSound();
    setTimeout(() => {
      window.location.href = "tap.html";
    }, 200);
  };

  // LOGOUT
  window.logoutUser = function () {
    playClickSound();
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 300);
  };
</script>Let me know if you also want to show the user’s name or coin balance on the dashboard.
