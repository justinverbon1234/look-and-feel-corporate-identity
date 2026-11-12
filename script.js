const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  document.documentElement.dataset.theme = storedTheme;
  themeToggle.checked = storedTheme === "dark";
}

themeToggle.addEventListener("change", () => {
  const theme = themeToggle.checked ? "dark" : "light";

  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
});

const saveButtons = document.querySelectorAll(".save-button");
const savedColumns = new Set(JSON.parse(localStorage.getItem("savedColumns") || "[]"));

saveButtons.forEach((button) => {
  const key = button.closest("[data-save-key]").dataset.saveKey;
  const icon = button.querySelector(".save-icon");
  const text = button.querySelector(".save-text");

  const updateSaveButton = (saved) => {
    button.classList.toggle("is-saved", saved);
    icon.textContent = saved ? "♥" : "♡";
    text.textContent = saved ? "Bewaard" : "Bewaar";
  };

  updateSaveButton(savedColumns.has(key));

  button.addEventListener("click", () => {
    if (savedColumns.has(key)) {
      savedColumns.delete(key);
    } else {
      savedColumns.add(key);
    }

    localStorage.setItem("savedColumns", JSON.stringify([...savedColumns]));
    updateSaveButton(savedColumns.has(key));
  });
});

const menu = document.querySelector(".site-nav");
const search = document.querySelector(".site-search");
const searchInput = document.querySelector(".site-search input");
const isDesktop = window.matchMedia("(min-width: 768px)");
const cards = document.querySelectorAll(".column-card");
const filterButtons = document.querySelectorAll("[data-filter]");

const filterCards = (filter) => {
  cards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });

    filterCards(button.dataset.filter);
  });
});

search.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const term = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    card.hidden = Boolean(term && !card.textContent.toLowerCase().includes(term));
  });
});

const syncMenu = ({ matches }) => {
  menu.open = matches;
};

syncMenu(isDesktop);
isDesktop.addEventListener("change", syncMenu);

search.addEventListener("toggle", () => {
  if (search.open) searchInput.focus();
});

menu.querySelector(".main-nav").addEventListener("click", (event) => {
  if (!event.target.closest("a") || isDesktop.matches) return;

  menu.open = false;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (search.open) {
    search.open = false;
    search.querySelector("summary").focus();
  } else if (menu.open && !isDesktop.matches) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".site-header")) return;

  search.open = false;

  if (!isDesktop.matches) menu.open = false;
});