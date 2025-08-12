const apiKey = import.meta.env.VITE_APIKEY;
const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const instructionsEl = document.getElementById("instructions");
const ingredientsListEl = document.getElementById("ingredients");

function getIngredientIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getFirstTwoWords(text) {
  return text.split(" ").slice(0, 2).join(" ") + " food";
}

async function loadIngredientInfo() {
  const id = getIngredientIdFromUrl();
  if (!id) {
    titleEl.textContent = "Ingredient not specified.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/${id}/information?amount=1&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (!data.original || !data.name) {
      titleEl.textContent = "Ingredient not found.";
      return;
    }

    titleEl.textContent = data.original;

    if (data.image) {
      imageEl.src = `https://spoonacular.com/cdn/ingredients_500x500/${data.image}`;
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
