// Firebase config (replace with your real config if needed)
const firebaseConfig = {
  apiKey: "AIzaSyBLoOGmPMpShYhIDNuF7PYR2U4fvA3vPZg",
  authDomain: "money-master-89c02.firebaseapp.com",
  projectId: "money-master-89c02",
  storageBucket: "money-master-89c02.appspot.com",
  messagingSenderId: "210193044537",
  appId: "1:210193044537:web:4e23aee0fd69c594027434"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Check login session
const uid = localStorage.getItem("uid");
if (!uid) {
  window.location.href = "index.html";
}

// Add 20 FAQs
const faqData = [
  {
    q: "How can I earn coins?",
    a: "You earn coins by tapping the bitcoin icon, completing daily tasks, and watching ads."
  },
  {
    q: "How much is 1000 coins worth?",
    a: "1000 coins = ₹1 INR. Minimum withdrawal is ₹200 (200,000 coins)."
  },
  {
    q: "How do I withdraw?",
    a: "Go to Dashboard > Wallet > Withdraw. Enter valid UPI, bank or PayPal info."
  },
  {
    q: "When will I receive the money?",
    a: "Withdrawals are processed within 48 hours after request if eligible."
  },
  {
    q: "What if my UPI ID is wrong?",
    a: "You must enter correct UPI/PayPal details. Invalid info can result in failed transfers."
  },
  {
    q: "Can I create multiple accounts?",
    a: "No. Only 3 accounts per IP/device are allowed to prevent abuse."
  },
  {
    q: "How do referrals work?",
    a: "Share your link. If someone signs up and watches 5 ads, you get 10,000 coins."
  },
  {
    q: "Can I change my email?",
    a: "Yes. Go to Settings > Change Email to update your account."
  },
  {
    q: "How do I change my password?",
    a: "Use Settings > Change Password. A valid login session is required."
  },
  {
    q: "How do I contact support?",
    a: "Use the complaint box above to send us your issue. We'll respond ASAP."
  },
  {
    q: "Why am I not getting coins?",
    a: "Ensure you're logged in. Taps near the dashboard or ad area won't count."
  },
  {
    q: "Can I earn with guest mode?",
    a: "Guest mode is temporary. To save coins, register an account."
  },
  {
    q: "What are daily tasks?",
    a: "Daily Tasks give bonus coins for watching videos, referrals, etc."
  },
  {
    q: "Can I withdraw to PayPal?",
    a: "Yes, you can select PayPal as a withdrawal option if available in your country."
  },
  {
    q: "How to become premium?",
    a: "Go to Dashboard > Premium. You'll see instructions when the feature is live."
  },
  {
    q: "Is this app free?",
    a: "Yes! You can use and earn without paying anything."
  },
  {
    q: "Why can't I tap continuously?",
    a: "There is a limit to prevent bots. Tap naturally to earn smoothly."
  },
  {
    q: "What if I don't receive my coins?",
    a: "Refresh or re-login. If issue persists, contact support."
  },
  {
    q: "Can I lose coins?",
    a: "Coins are saved online if logged in. Guest coins may reset."
  },
  {
    q: "How to report bugs?",
    a: "Use the complaint box or email support. We appreciate feedback!"
  }
];

// Initialize support page (called in HTML onload)
function initSupportPage() {
  const faqContainer = document.getElementById("faqList");
  if (!faqContainer) return;

  faqData.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "faq-item";

    const question = document.createElement("div");
    question.className = "faq-question";
    question.innerHTML = `${index + 1}. ${item.q} <span>+</span>`;

    const answer = document.createElement("div");
    answer.className = "faq-answer";
    answer.innerText = item.a;

    question.addEventListener("click", () => {
      answer.classList.toggle("show");
    });

    div.appendChild(question);
    div.appendChild(answer);
    faqContainer.appendChild(div);
  });

  const complaintInput = document.getElementById("complaintInput");
  const submitBtn = document.getElementById("submitComplaint");

  complaintInput.addEventListener("input", () => {
    submitBtn.style.display = complaintInput.value.trim() ? "inline-block" : "none";
  });

  submitBtn.addEventListener("click", () => {
    const message = complaintInput.value.trim();
    if (!message) {
      alert("Please enter your complaint before submitting.");
      return;
    }

    // Optional: Save to Firestore instead of just console
    db.collection("complaints").add({
      uid: uid,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert("Your complaint has been submitted. We'll get back to you soon.");
      complaintInput.value = "";
      submitBtn.style.display = "none";
    }).catch((error) => {
      alert("Failed to submit complaint. Please try again later.");
      console.error("Error submitting complaint:", error);
    });
  });
}

// Back navigation
function goBack() {
  const s = new Audio("assets/sound.mp3");
  s.play();
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 200);
}

