// North Star Bakery - Touchstone 4 Interactive Menu, Favorites & Form Validation

const MENU_ITEMS = [
  { id: "sourdough-loaf", name: "Artisan Sourdough Loaf", category: "Breads", price: "$8.50" },
  { id: "cin-roll", name: "Cardamom Cinnamon Roll", category: "Pastries", price: "$4.75" },
  { id: "focaccia", name: "Rosemary Sea Salt Focaccia", category: "Breads", price: "$7.25" },
  { id: "almond-croissant", name: "Twice-Baked Almond Croissant", category: "Pastries", price: "$5.25" }
];

const STORAGE_KEYS = {
  favorites: "nsb_favorites",
  filter: "nsb_selected_category"
};

let savedFavorites = loadFromStorage(STORAGE_KEYS.favorites, []);
let activeCategory = loadFromStorage(STORAGE_KEYS.filter, "All");

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Ignore storage quota errors in restricted contexts
  }
}

function toggleFavorite(itemId) {
  const index = savedFavorites.indexOf(itemId);
  if (index === -1) {
    savedFavorites.push(itemId);
  } else {
    savedFavorites.splice(index, 1);
  }
  saveToStorage(STORAGE_KEYS.favorites, savedFavorites);
  renderMenu();
  renderFavoritesSummary();
}

function setCategoryFilter(category) {
  activeCategory = category;
  saveToStorage(STORAGE_KEYS.filter, activeCategory);
  renderFilterButtons();
  renderMenu();
}

function renderFilterButtons() {
  const container = document.getElementById("nsb-filter-controls");
  if (!container) return;

  const categories = ["All", "Breads", "Pastries"];
  container.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.style.marginRight = "8px";
    btn.style.padding = "6px 12px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = activeCategory === cat ? "bold" : "normal";
    btn.setAttribute("aria-pressed", String(activeCategory === cat));
    btn.addEventListener("click", () => setCategoryFilter(cat));
    container.appendChild(btn);
  });
}

function renderMenu() {
  const container = document.getElementById("nsb-interactive-menu");
  if (!container) return;

  const visibleItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  container.innerHTML = "";

  visibleItems.forEach((item) => {
    const isFav = savedFavorites.includes(item.id);
    const card = document.createElement("div");
    card.style.border = "1px solid #3B2314";
    card.style.padding = "12px";
    card.style.marginBottom = "10px";

    const title = document.createElement("strong");
    title.textContent = `${item.name} (${item.category}) — ${item.price} `;

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.textContent = isFav ? "Saved Favorite ✓" : "Save Favorite";
    favBtn.style.cursor = "pointer";
    favBtn.addEventListener("click", () => toggleFavorite(item.id));

    card.appendChild(title);
    card.appendChild(favBtn);
    container.appendChild(card);
  });
}

function renderFavoritesSummary() {
  const summaryEl = document.getElementById("nsb-favorites-summary");
  if (!summaryEl) return;

  if (savedFavorites.length === 0) {
    summaryEl.textContent = "Saved Favorites (0): None selected yet.";
    return;
  }

  const names = MENU_ITEMS
    .filter((item) => savedFavorites.includes(item.id))
    .map((item) => item.name);

  summaryEl.textContent = `Saved Favorites (${names.length}): ${names.join(", ")}`;
}

function showFieldError(inputEl, errorId, message) {
  let errorEl = document.getElementById(errorId);
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = errorId;
    errorEl.style.color = "#991B1B";
    errorEl.style.fontSize = "0.9rem";
    errorEl.style.marginTop = "4px";
    inputEl.insertAdjacentElement("afterend", errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(errorId) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = "";
  }
}

function validateContactForm(event) {
  const form = event.target;
  const nameInput = form.querySelector('input[name="name"], #name') || form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[name="email"], #email') || form.querySelector('input[type="email"]');
  const messageInput = form.querySelector('textarea[name="message"], #message') || form.querySelector('textarea');

  let isValid = true;

  if (nameInput) {
    const nameVal = nameInput.value.trim();
    if (nameVal.length < 2) {
      showFieldError(nameInput, "nsb-name-error", "Please enter your name (at least 2 characters).");
      isValid = false;
    } else {
      clearFieldError("nsb-name-error");
    }
  }

  if (emailInput) {
    const emailVal = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      showFieldError(emailInput, "nsb-email-error", "Please enter a valid email address (e.g., name@example.com).");
      isValid = false;
    } else {
      clearFieldError("nsb-email-error");
    }
  }

  if (messageInput) {
    const msgVal = messageInput.value.trim();
    if (msgVal.length < 10) {
      showFieldError(messageInput, "nsb-message-error", "Please enter a message of at least 10 characters.");
      isValid = false;
    } else {
      clearFieldError("nsb-message-error");
    }
  }

 event.preventDefault(); 
  if (isValid) {
  const statusEl = document.getElementById("nsb-form-status");
  if (statusEl) {
    statusEl.textContent = "Thank you! Your request has been noted.";
  }
  event.target.reset() ;
}

  }

document.addEventListener("DOMContentLoaded", () => {
  renderFilterButtons();
  renderMenu();
  renderFavoritesSummary();

  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", validateContactForm);
  }
});
