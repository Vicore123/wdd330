import ExternalServices from "./externalServices.js";

const apiKey = import.meta.env.VITE_APIKEY;
const service = new ExternalServices(apiKey);

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const instructionsEl = document.getElementById("instructions");
const ingredientsListEl = document.getElementById("ingredients");

function getIngredientIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadIngredientInfo() {
  const id = getIngredientIdFromUrl();
  if (!id) {
    titleEl.textContent = "Ingredient not specified.";
    return;
  }

  try {
    const data = await service.getIngredientInfo(id);

    if (!data.name) {
      titleEl.textContent = "Ingredient not found.";
      return;
    }

    titleEl.textContent = data.name;

    if (data.imageUrl) {
      imageEl.src = data.imageUrl;
      imageEl.alt = data.name || "Ingredient image";
    } else {
      imageEl.src = "";
      imageEl.alt = "Image not available";
    }

    if (data.caloricBreakdown) {
      const cb = data.caloricBreakdown;
      instructionsEl.innerHTML = `
        <p><strong>Caloric Breakdown:</strong></p>
        <ul>
          <li>Protein: ${cb.percentProtein.toFixed(2)}%</li>
          <li>Fat: ${cb.percentFat.toFixed(2)}%</li>
          <li>Carbohydrates: ${cb.percentCarbs.toFixed(2)}%</li>
        </ul>
      `;
    } else {
      instructionsEl.innerHTML = "<p>Caloric information not available.</p>";
    }

    ingredientsListEl.innerHTML = "";
    if (data.nutrition && data.nutrition.nutrients && data.nutrition.nutrients.length > 0) {
      data.nutrition.nutrients.forEach(nutrient => {
        const li = document.createElement("li");
        li.textContent = `${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`;
        ingredientsListEl.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Nutritional information not available.";
      ingredientsListEl.appendChild(li);
    }
  } catch (error) {
    console.error("Error loading ingredient info:", error);
    titleEl.textContent = "Error loading ingredient information.";
  }
}

document.addEventListener("DOMContentLoaded", loadIngredientInfo);