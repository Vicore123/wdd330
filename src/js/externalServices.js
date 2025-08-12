async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {
  constructor(apiKey, UNSPLASH_ACCESS_KEY) {
    this.apiKey = apiKey;
    this.UNSPLASH_ACCESS_KEY = UNSPLASH_ACCESS_KEY;
  }

  async getRecipes(query) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${this.apiKey}&query=${query}`);
      const data = await convertToJson(response);
      return data.results;
    } catch (err) {
      console.error("Error fetching api:", err);
      return [];
    }
  }

  async getRecipe(id) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${this.apiKey}`);
      const data = await convertToJson(response);
      return data;
    } catch (err){
      console.error("Error fetching api:", err);
    }
  }

  async getInstructions(id) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${this.apiKey}`);
      const data = await convertToJson(response);
      return data;
    } catch (err){
      console.error("Error fetching api:", err);
      return null;
    }
  }

  async getRandomRecipes(number = 5) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${this.apiKey}&number=${number}`);
      const data = await convertToJson(response);
      return data.recipes;
    } catch (err) {
      console.error("Error fetching random recipes:", err);
      return [];
    }
  }

  async getIngredientInfo(ingredientId) {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${this.apiKey}`
      );
      const ingredient = await response.json();

      return {
        name: ingredient.name,
        imageUrl: `https://spoonacular.com/cdn/ingredients_500x500/${ingredient.image}`
      };
    } catch (error) {
      console.error("Erro ao buscar ingrediente:", error);
      return {
        name: null,
        imageUrl: null
      };
    }
  }


}
