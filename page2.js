lucide.createIcons();
const items = document.querySelectorAll(".timeline-item");
const timeline = document.querySelector(".timeline");
const ending = document.querySelector(".ending");

let ticking = false;

function updateAnimations() {

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  /* TIMELINE LINE */
  const timelineTop = timeline.offsetTop;
  const lastItem = items[items.length - 1];
  const lastItemBottom = lastItem.offsetTop + lastItem.offsetHeight;

  let progress = (scrollY + windowHeight - timelineTop) / lastItemBottom;
  progress = Math.min(Math.max(progress, 0), 1);

  timeline.style.setProperty("--grow", progress);
  timeline.style.setProperty("--timeline-height", lastItemBottom + "px");

  /* ITEMS */
  items.forEach(item => {
    const rect = item.getBoundingClientRect();

    if (rect.top < windowHeight - 100) {
      item.classList.add("show");
    }

    /* PARALLAX (optimized) */
    const img = item.querySelector("img");
    if (img) {
      let speed = rect.top * 0.05; /* reduced = smoother */
      img.style.transform = `translateY(${speed}px)`;
    }
  });

  /* ENDING */
  if (ending) {
    const rect = ending.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      ending.classList.add("show");
    }
  }

  ticking = false;
}

/* OPTIMIZED SCROLL */
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateAnimations);
    ticking = true;
  }
});

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
function goToClass() {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "page3.html";
  }, 600); // match CSS duration
}