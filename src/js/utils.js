async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export default function renderListWithTemplate(template, parentElement, list, quantity, position = "afterbegin", clear = false) {
  
  let htmlStrings = [];
  for (let i = 0; i < quantity; i++) {
    htmlStrings.push(template(list[i]));
  }

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""))
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("partials/header.html");
  const footerTemplate = await loadTemplate("partials/footer.html");
  const favoritesTemplate = await loadTemplate("partials/favorites.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  const favoritesElement = document.querySelector("#favorites");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  renderWithTemplate(favoritesTemplate, favoritesElement);
}

export function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}