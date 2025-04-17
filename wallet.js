// wallet.js

// Load user coin balance and calculate INR
function loadWallet() {
  const coinEl = document.getElementById("coinDisplay");
  const inrEl = document.getElementById("inrValue");

  // Step 1: Get coins from localStorage (default fallback)
  let coins = parseInt(localStorage.getItem("coinBalance")) || 0;

  // Optional: Load from Firebase if needed (future scaling)

  // Step 2: Update HTML values
  coinEl.textContent = coins;
  inrEl.textContent = (coins / 1000).toFixed(2); // 1000 coins = ₹1
}
