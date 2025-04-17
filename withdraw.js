// Load wallet balance and update UI
function loadWithdrawPage() {
  const coins = parseInt(localStorage.getItem("coins") || "0");
  const inrValue = (coins / 1000).toFixed(2);

  document.getElementById("coinDisplay").textContent = coins;
  document.getElementById("inrValue").textContent = inrValue;

  // Check eligibility
  const confirmBtn = document.getElementById("confirmBtn");
  if (coins >= 200000) {
    confirmBtn.classList.add("enabled");
    confirmBtn.disabled = false;
  } else {
    confirmBtn.classList.remove("enabled");
    confirmBtn.disabled = true;
  }
}

// Show selected payment form
function showForm(method) {
  document.getElementById("upiForm").style.display = "none";
  document.getElementById("bankForm").style.display = "none";
  document.getElementById("paypalForm").style.display = "none";

  if (method === "upi") {
    document.getElementById("upiForm").style.display = "block";
  } else if (method === "bank") {
    document.getElementById("bankForm").style.display = "block";
  } else if (method === "paypal") {
    document.getElementById("paypalForm").style.display = "block";
  }
}

// Handle withdrawal submission
function submitWithdraw() {
  const method = document.querySelector('input[name="method"]:checked')?.value;
  const coins = parseInt(localStorage.getItem("coins") || "0");

  if (coins < 200000 || !method) {
    alert("You must have at least 200,000 coins and select a method.");
    return;
  }

  const snd = new Audio("assets/sound.mp3");
  snd.play();

  let details = {};

  if (method === "upi") {
    const upiID = document.getElementById("upiID").value.trim();
    const upiAmt = document.getElementById("upiAmount").value.trim();
    if (!upiID || !upiAmt) return alert("Please fill all UPI fields.");
    details = { method, upiID, amount: upiAmt };
  }

  if (method === "bank") {
    const name = document.getElementById("bankName").value.trim();
    const ifsc = document.getElementById("bankIFSC").value.trim();
    const acc = document.getElementById("bankAcc").value.trim();
    const amt = document.getElementById("bankAmount").value.trim();
    if (!name || !ifsc || !acc || !amt) return alert("Please fill all Bank fields.");
    details = { method, name, ifsc, acc, amount: amt };
  }

  if (method === "paypal") {
    const payEmail = document.getElementById("paypalEmail").value.trim();
    const payAmt = document.getElementById("paypalAmount").value.trim();
    if (!payEmail || !payAmt) return alert("Please fill all PayPal fields.");
    details = { method, email: payEmail, amount: payAmt };
  }

  console.log("Withdraw Request:", details);
  alert("Withdraw request submitted successfully!");

  // In production, send this data to server or Firebase
}
