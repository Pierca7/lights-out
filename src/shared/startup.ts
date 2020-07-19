import AppController from "../controllers/AppController.js"
import Templates from "./TemplateProvider.js";

window.onload = async () => {
    const templates = await Templates.create();
    
    new AppController(templates);
}