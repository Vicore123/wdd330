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

  async getIngredientInfo(ingredientName) {
    if (!this.UNSPLASH_ACCESS_KEY) {
      console.warn("Unsplash Access Key não definida.");
      return {
        name: ingredientName,
        imageUrl: null,
      };
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(ingredientName)}&client_id=${this.UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return {
          name: ingredientName,
          imageUrl: data.results[0].urls.small,
        };
      } else {
        return {
          name: ingredientName,
          imageUrl: null,
        };
      }
    } catch (error) {
      console.error("Erro ao buscar imagem no Unsplash:", error);
      return {
        name: ingredientName,
        imageUrl: null,
      };
    }
  }
}
