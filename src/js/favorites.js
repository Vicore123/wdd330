import { getLocalStorage, setLocalStorage } from "./utils.js";

function waitForElement(selector, callback, timeout = 5000) {
  const intervalTime = 100;
  let elapsed = 0;
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      clearInterval(interval);
      callback(el);
    } else if ((elapsed += intervalTime) >= timeout) {
      clearInterval(interval);
      console.error(`Element ${selector} not found`);
    }
  }, intervalTime);
}

function favoriteCardTemplate(recipe) {
  return `
    <li>
      <div class="card-link">
        <h2>${recipe.title}</h2>
        <button class="remove-favorite" data-id="${recipe.id}" aria-label="Remove favorite">X</button>
        <a href="../../recipe.html?id=${recipe.id}">
          <img src="${recipe.image}" alt="${recipe.title}">
        </a>
      </div>
    </li>`;
}

function renderFavoritesList(container, recipes) {
  container.innerHTML = recipes.length
    ? recipes.map(favoriteCardTemplate).join("")
    : "<li>You don't have any favorites yet.</li>";
}

function updateFavoriteButtons(favorites) {
  document.querySelectorAll(".add-favorites").forEach(btn => {
    const id = btn.dataset.id;
    const active = favorites.includes(id);
    btn.innerHTML = active
      ? `<img src="../images/favorited.png" alt="Active favorite">`
      : `<img src="../images/favorite.png" alt="Add to favorites">`;
    btn.setAttribute("aria-pressed", active);
  });
}

async function loadFavorites(container, dataSource) {
  const ids = getLocalStorage("favorites") || [];
  if (!ids.length) {
    container.innerHTML = "<li>You don't have any favorites yet.</li>";
    updateFavoriteButtons([]);
    return [];
  }
  try {
    const recipes = await Promise.all(ids.map(id => dataSource.getRecipe(id)));
    renderFavoritesList(container, recipes);
    updateFavoriteButtons(ids);
    return recipes;
  } catch {
    container.innerHTML = "<li>Failed to load favorites.</li>";
    updateFavoriteButtons([]);
    return [];
  }
}

function initFavorites(btnOpen, menu, dataSource) {
  const favoritesList = document.getElementById("favorites-list");
  let favoriteRecipes = [];

  btnOpen.addEventListener("click", async e => {
    e.stopPropagation();
    menu.classList.toggle("active");
    if (menu.classList.contains("active")) {
      favoriteRecipes = await loadFavorites(favoritesList, dataSource);
    }
  });

  menu.querySelector(".close-btn")?.addEventListener("click", () => menu.classList.remove("active"));

  menu.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", () => menu.classList.remove("active"));

  favoritesList.addEventListener("click", async e => {
    const btn = e.target.closest(".remove-favorite");
    if (!btn) return;

    const id = btn.dataset.id;
    let favorites = getLocalStorage("favorites") || [];
    favorites = favorites.filter(fav => fav !== id);
    setLocalStorage("favorites", favorites);

    favoriteRecipes = await loadFavorites(favoritesList, dataSource);
  });

  updateFavoriteButtons(getLocalStorage("favorites") || []);

  document.addEventListener("click", async e => {
    const btn = e.target.closest(".add-favorites");
    if (!btn) return;

    const id = btn.dataset.id;
    let favorites = getLocalStorage("favorites") || [];
    const has = favorites.includes(id);

    favorites = has ? favorites.filter(fav => fav !== id) : [...favorites, id];
    setLocalStorage("favorites", favorites);

    updateFavoriteButtons(favorites);

    if (menu.classList.contains("active")) {
      favoriteRecipes = await loadFavorites(favoritesList, dataSource);
    }
  });
}

function startFavorites(dataSource) {
  waitForElement("#favorites-menu", btnOpen => {
    waitForElement("#favorites", menu => {
      initFavorites(btnOpen, menu, dataSource);
    });
  });
}

export { startFavorites };