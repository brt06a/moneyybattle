<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBnioJIpecVz8wy8cvMfmMq3R04gUNuCv8",
    authDomain: "money-d5a6e.firebaseapp.com",
    projectId: "money-d5a6e",
    storageBucket: "money-d5a6e.firebasestorage.app",
    messagingSenderId: "1018038143768",
    appId: "1:1018038143768:web:450b8c15f47326d066ec6d",
    measurementId: "G-N5TEQWEXQW"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
