/* ===== API ===== */
const API = "https://script.google.com/macros/s/AKfycbw_1xXZmIN5Q61JU1r35BlB1Swoli21GIfxipbLkh8IqbOjHAwjKZZR4b9p51RY5X16nQ/exec"; // 👈 PUT YOUR API HERE
lucide.createIcons();
const wall = document.getElementById("wall");

// Open Modal
function openModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  setTimeout(() => { modal.style.opacity = "1"; }, 10);
}

// Close modal if click outside box
document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.opacity = "0";
  setTimeout(() => { modal.style.display = "none"; }, 300);
}

/* ===== CREATE NOTE ===== */
function createNote(name, message, date) {
  const note = document.createElement("div");
  note.className = "note";

 note.innerHTML = `
  <div class="message">${(message || "").replace(/\n/g, "<br>")}</div>
  <div class="divider"></div>
  <div class="name">— ${name || "Anonymous"}</div>
  <div class="time">${date || ""}</div>
`;
  wall.prepend(note);
}

/* ===== LOAD FROM BACKEND (JSON) ===== */
async function loadMessages() {
  try {
    const res = await fetch(API);

    if (!res.ok) {
      console.log("API Error:", res.status);
      return;
    }

    const data = await res.json();   // ✅ IMPORTANT FIX

    wall.innerHTML = ""; // clear old (avoid duplicates)

    data.forEach(msg => {
      createNote(
        msg.name,
        msg.comment,
        msg.timestamp
      );
    });

  } catch (err) {
    console.log("Error loading messages:", err);
  }
}

/* ===== SUBMIT MESSAGE ===== */
function submitMessage() {
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");

  const name = nameInput.value || "Anonymous";
  const message = messageInput.value;

  if (!message.trim()) return;

  createNote(name, message, new Date().toLocaleString());

fetch(API, {
  method: "POST",

  headers: {
    "Content-Type": "text/plain;charset=utf-8"   // 👈 VERY IMPORTANT
  },

  body: JSON.stringify({
    name: name,
    comment: message
  })
})
.then(res => res.text())
.then(data => {
  console.log("Saved:", data);
})
.catch(err => {
  console.log("POST error:", err);
});

  nameInput.value = "";
  messageInput.value = "";

  closeModal();
}
/* ===== INITIAL LOAD ===== */
/* ===== INITIAL LOAD WITH LOADER ===== */
window.addEventListener("load", async () => {
  await loadMessages();   // load from backend first

  // wait 2 sec minimum (smooth feel)
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 600);

  }, 1000);
});
note.addEventListener("click", () => {
  openNoteModal(note.innerHTML);
});
function openNoteModal(content) {
  const modal = document.getElementById("noteModal");
  const modalContent = document.getElementById("noteModalContent");

  modalContent.innerHTML = content;
  modal.style.display = "flex";
}

document.getElementById("noteModal").addEventListener("click", (e) => {
  if (e.target.id === "noteModal") {
    e.target.style.display = "none";
  }
});

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("open");
}