// register.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGmEOf7tUoP9OGL8I2OdUmuAmJmjB1lwE",
  authDomain: "money-master-89c02.firebaseapp.com",
  projectId: "money-master-89c02",
  storageBucket: "money-master-89c02.appspot.com",
  messagingSenderId: "39858594207",
  appId: "1:39858594207:web:f4eb3ff396f7dfb6a6b3db",
  measurementId: "G-K9FKX0PC8Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const isMobile = document.querySelector('.tab.active').dataset.value === 'mobile';

  if (!fullName || !emailOrPhone || !password || !confirmPassword || password !== confirmPassword) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("emailOrPhone", "==", emailOrPhone), where("registrationDate", "==", today));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("You have already registered today.");
      return;
    }

    const email = isMobile ? `${emailOrPhone}@money.master` : emailOrPhone;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      fullName,
      emailOrPhone,
      registrationDate: today,
      type: isMobile ? "mobile" : "email",
      coins: 0
    });

    alert("Registration successful!");
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
    alert("Registration failed: " + error.message);
  }
});

// Tab toggle
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const input = document.getElementById('emailOrPhone');
    input.placeholder = tab.dataset.value === 'mobile' ? "Mobile Number" : "Email";
    input.type = tab.dataset.value === 'mobile' ? "tel" : "email";
  });
});
