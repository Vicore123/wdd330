async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {
  constructor(apiKey) {
    this.apiKey = apiKey
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
      return data
    } catch (err){
      console.error("Error fetching api:", err);
    }
  }

  async getInstructions(id) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${this.apiKey}`)
      const data = await convertToJson(response)
      return data
    
    } catch (err){

    }
  }
}