import { loadHeaderFooter } from "./utils";
import ExternalServices from "./externalServices.js";
import { startFavorites } from "./favorites.js";

const apiKey = import.meta.env.VITE_APIKEY;
const recipesDataSource = new ExternalServices(apiKey);

loadHeaderFooter()
startFavorites(recipesDataSource);