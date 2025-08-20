// ========== Theme Toggle ==========
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const applyTheme = (t) => {
    document.body.classList.toggle("light", t === "light");
    themeToggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
  };

  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);

  themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Get all navbars on the page
  const navbars = document.querySelectorAll(".navbar");

  navbars.forEach(navbar => {
    const navToggle = navbar.querySelector(".nav-toggle");
    const navLinks = navbar.querySelector(".nav-links");

    if (navToggle && navLinks) {
      // Toggle open/close
      navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
      });

      // Close menu when a link is clicked (mobile UX)
      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("open");
        });
      });
    }
  });
});

/* =================== MODAL + POEMS LOGIC =================== */

const modal = document.getElementById("poemModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalAuthor = document.getElementById("modalAuthor");
const closeBtn = document.querySelector(".close-btn");

let currentPoemIndex = -1;

// Render poem in modal (no index logic here)
function renderPoem(poem) {
  if (!modal || !poem) return;
  modal.style.display = "flex";
  modalTitle.textContent = poem.title || "";
  modalAuthor.textContent = poem.author ? "— " + poem.author : "";

  const lines = (poem.content || "").split("\n");
  modalContent.innerHTML = lines
    .map((line, i) => `<p style="--delay:${i * 0.15}s">${line}</p>`)
    .join("");
}

// Go to poem by index
function goToIndex(i) {
  if (!Array.isArray(poems) || poems.length === 0) return;

  // wrap around using modulo
  currentPoemIndex = (i + poems.length) % poems.length;

  renderPoem(poems[currentPoemIndex]);
  updateNavDisabled();
}


// Close modal
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ========== Poem Cards ==========
const poemList = document.getElementById("poemList");
if (poemList && typeof poems !== "undefined") {
  poems.forEach((poem, index) => {
    const card = document.createElement("div");
    card.className = "poem-card";
    const previewText = poem.excerpt
      ? poem.excerpt
      : (poem.content ? poem.content.substring(0, 60) + "..." : "");
    card.innerHTML = `<h3>${poem.title}</h3><p>${previewText}</p>`;
    card.addEventListener("click", () => goToIndex(index));
    poemList.appendChild(card);
  });
}

// ========== Prev / Next ==========
function ensureNavButtons() {
  const modalContentEl = document.querySelector("#poemModal .modal-content");
  if (!modalContentEl) return;
  let prev = document.getElementById("prevPoem");
  let next = document.getElementById("nextPoem");
  if (!prev || !next) {
    const nav = document.createElement("div");
    nav.className = "modal-nav";
    nav.innerHTML = `
      <button id="prevPoem">⟵ पिछली</button>
      <button id="nextPoem">अगली ⟶</button>
    `;
    modalContentEl.appendChild(nav);
    prev = nav.querySelector("#prevPoem");
    next = nav.querySelector("#nextPoem");
  }
  prev.addEventListener("click", () => goToIndex(currentPoemIndex - 1));
  next.addEventListener("click", () => goToIndex(currentPoemIndex + 1));
}

function updateNavDisabled() {
  const prev = document.getElementById("prevPoem");
  const next = document.getElementById("nextPoem");
  if (prev) prev.disabled = false;
  if (next) next.disabled = false;
}


// ========== Deep link ==========
document.addEventListener("DOMContentLoaded", () => {
  ensureNavButtons();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("poem");
  if (id !== null && poems[id]) {
    goToIndex(parseInt(id, 10));
  }
});
