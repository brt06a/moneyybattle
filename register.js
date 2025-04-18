<!-- Firebase App & Auth -->
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js"></script>

<script>
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
</script>

<script>
  let isEmail = true;

  document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.getElementById('emailBtn');
    const mobileBtn = document.getElementById('mobileBtn');
    const emailInput = document.getElementById('emailInput');
    const createBtn = document.getElementById('createBtn');
    const fullName = document.getElementById('fullName');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const referral = document.getElementById('referral');

    emailBtn.onclick = () => {
      isEmail = true;
      emailBtn.classList.add('active');
      mobileBtn.classList.remove('active');
      emailInput.placeholder = 'Email';
    };

    mobileBtn.onclick = () => {
      isEmail = false;
      mobileBtn.classList.add('active');
      emailBtn.classList.remove('active');
      emailInput.placeholder = 'Mobile Number (+91...)';
    };

    createBtn.onclick = () => {
      const name = fullName.value.trim();
      const emailOrPhone = emailInput.value.trim();
      const pass = password.value;
      const cpass = confirmPassword.value;
      const refer = referral.value.trim();

      if (!name || !emailOrPhone || !pass || !cpass) {
        alert("Please fill all required fields.");
        return;
      }

      if (pass !== cpass) {
        alert("Passwords do not match.");
        return;
      }

      if (isEmail) {
        auth.createUserWithEmailAndPassword(emailOrPhone, pass)
          .then(cred => {
            const uid = cred.user.uid;
            return db.ref("users/" + uid).set({
              name,
              email: emailOrPhone,
              coins: 0,
              referredBy: refer || null
            });
          })
          .then(() => window.location.href = "tap.html")
          .catch(err => alert(err.message));
      } else {
        // Phone auth using invisible reCAPTCHA
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('createBtn', {
          size: 'invisible',
          callback: response => console.log("reCAPTCHA solved")
        });

        auth.signInWithPhoneNumber(emailOrPhone, window.recaptchaVerifier)
          .then(confirmResult => {
            const code = prompt("Enter OTP sent to your mobile:");
            if (!code) throw new Error("OTP not entered.");

            return confirmResult.confirm(code);
          })
          .then(cred => {
            const uid = cred.user.uid;
            return db.ref("users/" + uid).set({
              name,
              phone: emailOrPhone,
              coins: 0,
              referredBy: refer || null
            });
          })
          .then(() => window.location.href = "tap.html")
          .catch(err => alert(err.message));
      }
    };

    // Move bitcoin icon
    const icon = document.getElementById('movingBitcoin');
    function moveIcon() {
      const x = Math.random() * (window.innerWidth - 40);
      const y = Math.random() * (window.innerHeight - 40);
      icon.style.left = `${x}px`;
      icon.style.top = `${y}px`;
    }
    setInterval(moveIcon, 2500);
  });
</script>
