import renderListWithTemplate from "./utils"

function recipeCardTemplate(recipe) {
  return `
    <li>
      <a href="../../recipe.html?id=${recipe.id}" class="card-link">
        <h2>${recipe.title}</h2>
        <button id="add-favorites"><img src="../images/favorite.png" alt="add to favorites"></button>
        <img src="${recipe.image}" alt="${recipe.title}">
      </a>
    </li>
  `
}

export default class RecipeListing {
  constructor(category, dataSource, listElement, quantity = 10) {
    this.dataSource = dataSource
    this.category = category
    this.listElement = listElement
    this.quantity = quantity
  }

  async init() {
    let list;
    if (this.category === "random") {
      list = await this.dataSource.getRandomRecipes(this.quantity);
    } else {
      list = await this.dataSource.getRecipes(this.category);
    }

    if (!Array.isArray(list)) {
      throw new Error("expected an array of recipes")
    }

    this.renderList(list);
  }

  renderList(list) {
    const productList = document.createElement("ul");
    productList.classList.add("listing")
    renderListWithTemplate(recipeCardTemplate, productList, list, this.quantity)
    this.listElement.appendChild(productList);
  }
}
