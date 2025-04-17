// leaderboard.js

document.addEventListener("DOMContentLoaded", loadLeaderboard);

function loadLeaderboard() {
  const leaderList = document.getElementById("leaderList");

  const users = [
    "Riya Sharma",
    "Amit Verma",
    "Neha Patel",
    "Rahul Mehra",
    "Pooja Yadav",
    "Sanjay Singh",
    "Divya Joshi",
    "Ankit Gupta",
    "Sneha Rao",
    "Vikram Chauhan"
  ];

  users.forEach((name, index) => {
    // Generate INR earnings between ₹50,000 and ₹400,000
    const inr = Math.floor(Math.random() * 350000) + 50000;
    const coins = inr * 1000;

    const entry = document.createElement("div");
    entry.className = "leader-entry";

    const avatar = document.createElement("img");
    avatar.src = `assets/avtar${index + 1}.png`;
    avatar.alt = `Avatar ${index + 1}`;

    const info = document.createElement("div");
    info.className = "leader-info";

    const nameEl = document.createElement("h4");
    nameEl.textContent = name;

    const earnEl = document.createElement("p");
    earnEl.textContent = `₹${inr.toLocaleString()} earned (${coins.toLocaleString()} coins)`;

    info.appendChild(nameEl);
    info.appendChild(earnEl);

    entry.appendChild(avatar);
    entry.appendChild(info);

    leaderList.appendChild(entry);
  });
}
