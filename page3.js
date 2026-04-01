lucide.createIcons();
let username = localStorage.getItem("username");

if (!username) {
  username = prompt("Enter your name");
  localStorage.setItem("username", username || "Anonymous");
}
const API_URL = "https://script.google.com/macros/s/AKfycbwaI7j2mykLHt0gtQpypz-Os5xKbaK7fOtu5sAuiz4jFWjPAQcOrDLWRKyarRAm7Dqb/exec";
/* NAVBAR SCROLL */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* SCROLL ANIMATION */
const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
  const trigger = window.innerHeight - 100;

  cards.forEach(card => {
    if (card.getBoundingClientRect().top < trigger) {
      card.classList.add("show");
    }
  });
});

/* FILTER */
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      card.style.display =
        filter === "all" || card.dataset.category === filter
          ? "block"
          : "none";
    });

  });
});

/* SEARCH */
document.getElementById("search").addEventListener("keyup", e => {
  const val = e.target.value.toLowerCase();

  cards.forEach(card => {
    card.style.display = card.dataset.name.includes(val)
      ? "block"
      : "none";
  });
});
/* LOADER */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 1500); // 3 seconds
});
const modal = document.getElementById("yearbookModal");

const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalRole = document.getElementById("modalRole");

let currentPerson = "";

/* OPEN MODAL */
document.querySelectorAll(".hover-btn button").forEach((btn, index) => {

  btn.addEventListener("click", () => {

    const card = btn.closest(".card");

    const img = card.querySelector("img").src;
    const name = card.querySelector("h3").innerText;
    const role = card.querySelector("p").innerText;

    modalImg.src = img;
    modalName.innerText = name;
    modalRole.innerText = role;

    currentPerson = card.dataset.name;

    modal.style.display = "flex";

    loadMessages();
  });

});

/* CLOSE MODAL (click outside) */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
const messagesDiv = document.getElementById("messages");
const replyCount = document.getElementById("replyCount");
const input = document.getElementById("msgInput");

/* LOCAL STORAGE (temporary backend) */

function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff/60) + " min ago";
  if (diff < 86400) return Math.floor(diff/3600) + " hr ago";

  return date.toLocaleDateString();
}
/* LOAD */
async function loadMessages() {

  const res = await fetch(API_URL);
  const data = await res.json();

  messagesDiv.innerHTML = "";

  const filtered = data.filter(m => m.person === currentPerson);

  filtered.reverse().forEach(msg => {

    const div = document.createElement("div");
    div.classList.add("message");

    const time = formatTime(new Date(msg.time));

    div.innerHTML = `
      <div class="msg-header">
        <span class="username">${msg.user}</span>
        <span class="time">${time}</span>
      </div>
      <p class="msg-text">${msg.message}</p>
    `;

    messagesDiv.appendChild(div);
  });

  replyCount.innerText = filtered.length + " replies";
}
/* SEND MESSAGE */
document.getElementById("sendBtn").addEventListener("click", async () => {

  const name = document.getElementById("nameInput").value.trim() || "Anonymous";
  const text = input.value.trim();

  if (!text) return;

  const now = new Date();

  /* 🔥 INSTANT UI MESSAGE (optimistic) */
  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = `
    <div class="msg-header">
      <span class="username">${name}</span>
      <span class="time">Just now</span>
    </div>
    <p class="msg-text">${text}</p>
  `;

  messagesDiv.prepend(div); // show on top instantly
  replyCount.innerText = parseInt(replyCount.innerText) + 1 + " replies";

  input.value = "";

  /* 🔗 SEND TO BACKEND */
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      person: currentPerson,
      user: name,
      message: text,
      time: now.toISOString()
    })
  });

});
/* AUTO REFRESH EVERY 3 SEC */
setInterval(() => {
  if (modal.style.display === "flex") {
    loadMessages();
  }
}, 3000);