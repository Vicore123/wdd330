import ExternalServices from "./externalServices";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const apiKey = import.meta.env.VITE_APIKEY;
const recipesDataSource = new ExternalServices(apiKey);

const title = document.querySelector("#title");
const image = document.querySelector("#image");
const ingredients = document.querySelector("#ingredients");
const instructions = document.querySelector("#instructions");

async function displayRecipe() {
  const data = await recipesDataSource.getRecipe(id);
  const recipeInstructions = await recipesDataSource.getInstructions(id);

  title.textContent = data.title;
  image.src = data.image;
  image.alt = data.title;

  data.extendedIngredients.forEach(ingredient => {
    const li = document.createElement("li");

    const highlighted = ingredient.original.replace(
      new RegExp(ingredient.name, "i"),
      `<a href="ingredient.html?id=${ingredient.id}"><strong>${ingredient.name}</strong></a>`
    );

    li.innerHTML = highlighted;
    ingredients.appendChild(li);
  });

  if (recipeInstructions.length > 0 && recipeInstructions[0].steps) {
    recipeInstructions[0].steps.forEach(step => {
      const stepElement = document.createElement("div");
      stepElement.classList.add("instruction-step");

      stepElement.innerHTML = `
        <h3>Step ${step.number}</h3>
        <p>${step.step}</p>
      `;

      instructions.appendChild(stepElement);
    });
  }
}

displayRecipe();
