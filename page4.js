const cards = document.querySelectorAll(".card");
lucide.createIcons();
/* LOADER */
window.onload = () => {
  setTimeout(() => {
    document.querySelector(".loader").style.opacity = "0";
    setTimeout(() => {
      document.querySelector(".loader").style.display = "none";
    }, 500);
  }, 3000);
};

/* SCROLL REVEAL */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

/* FILTER */
function filterImages(category, btn) {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  cards.forEach(card => {
    card.style.display =
      category === "all" || card.dataset.category === category
        ? "block"
        : "none";
  });
}
const lazyImages = document.querySelectorAll(".lazy");

const imgObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;

      // load image
      img.src = img.dataset.src;

      img.onload = () => {
        img.classList.add("loaded");
      };

      observer.unobserve(img);
    }
  });
}, { threshold: 0.1 });

lazyImages.forEach(img => imgObserver.observe(img));
/* MODAL */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");

document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

modal.addEventListener("click", () => {
  modal.style.display = "none";
});
const toggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


toggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  toggle.classList.toggle("active");
});