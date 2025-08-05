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

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}