import ExternalServices from "./externalServices";
import RecipeListing from "./recipeListing";

const apiKey = import.meta.env.VITE_APIKEY;
const recipesDataSource = new ExternalServices(apiKey)
const discover = document.querySelector(".discover")
const recipecipeList = new RecipeListing("apple", recipesDataSource, discover, 3)

recipecipeList.init()