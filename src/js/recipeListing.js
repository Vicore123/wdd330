import renderListWithTemplate from "./utils"

function recipeCardTemplate(recipe) {
  return `
    <li>
      <button id="add-favorites"><img src="../images/favorite.png" alt="add to favorites"></button>
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}">
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
    const list = await this.dataSource.getRecipes(this.category);

    if(!Array.isArray(list)) {
      throw new Error("expected an array of products")
    }

    this.renderList(list)
  }

  renderList(list) {
    const oldList = this.listElement.querySelector("ul")
    if (oldList) oldList.remove()

    const productList = document.createElement("ul");
    productList.classList.add("discovery")
    renderListWithTemplate(recipeCardTemplate, productList, list, this.quantity)
    this.listElement.appendChild(productList);
  }
}