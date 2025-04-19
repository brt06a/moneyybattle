import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

let isEmailMode = true;
document.getElementById('emailBtn').addEventListener('click', () => {
  isEmailMode = true;
  document.getElementById('emailField').style.display = 'block';
  document.getElementById('mobileField').style.display = 'none';
  document.getElementById('emailBtn').classList.add('toggle-email');
  document.getElementById('mobileBtn').classList.remove('toggle-email');
});

document.getElementById('mobileBtn').addEventListener('click', () => {
  isEmailMode = false;
  document.getElementById('emailField').style.display = 'none';
  document.getElementById('mobileField').style.display = 'block';
  document.getElementById('emailBtn').classList.remove('toggle-email');
  document.getElementById('mobileBtn').classList.add('toggle-email');
});

document.getElementById('createAccountBtn').addEventListener('click', async () => {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!name || password.length < 6 || password !== confirmPassword || (isEmailMode && !email) || (!isEmailMode && !mobile)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userQuery = query(
    collection(db, "users"),
    where(isEmailMode ? "email" : "mobile", "==", isEmailMode ? email : mobile)
  );

  const querySnapshot = await getDocs(userQuery);
  for (let docSnap of querySnapshot.docs) {
    const createdAt = docSnap.data().createdAt?.toDate?.();
    if (createdAt && createdAt >= today) {
      alert("You’ve already registered today.");
      return;
    }
  }

  try {
    const credential = isEmailMode
      ? await createUserWithEmailAndPassword(auth, email, password)
      : { user: { uid: "anonymous-" + Date.now() } }; // Placeholder for mobile mode

    await addDoc(collection(db, "users"), {
      uid: credential.user.uid,
      fullName: name,
      email: isEmailMode ? email : null,
      mobile: isEmailMode ? null : mobile,
      createdAt: Timestamp.now()
    });

    window.location.href = "tap.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
});
