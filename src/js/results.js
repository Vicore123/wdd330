import ExternalServices from "./externalServices";
import RecipeListing from "./recipeListing";
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

const apiKey = import.meta.env.VITE_APIKEY;
const recipesDataSource = new ExternalServices(apiKey)
const results = document.querySelector(".results")
const recipecipeList = new RecipeListing(query, recipesDataSource, results)

recipecipeList.init()