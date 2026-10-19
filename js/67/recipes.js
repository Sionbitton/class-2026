const recipeSelect = document.querySelector('#recipeSelect');
const recipeDetails = document.querySelector('#recipeDetails');
const recipeName = document.querySelector('#recipeName');
const recipePicture = document.querySelector('#recipePicture');
const ingredientsList = document.querySelector('#ingredients');
const statusElem = document.querySelector('#status');
let latestRequest = 0;

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load ${url}: ${response.status}`);
    }
    return await response.json();
}

async function loadRecipeList() {
    try {
        const recipes = await loadJson('recipes.json');
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.url;
            option.textContent = recipe.name;
            recipeSelect.appendChild(option);
        });
        recipeSelect.disabled = false;
        statusElem.textContent = 'Select a recipe to see its picture and ingredients.';
    } catch (error) {
        statusElem.textContent = error.message;
    }
}

function displayRecipe(recipe) {
    recipeName.textContent = recipe.name;
    recipePicture.src = recipe.picture;
    recipePicture.alt = recipe.name + ' illustration';
    ingredientsList.replaceChildren();

    recipe.ingredients.forEach(ingredient => {
        const item = document.createElement('li');
        item.textContent = ingredient;
        ingredientsList.appendChild(item);
    });

    recipeDetails.hidden = false;
    statusElem.textContent = '';
}

async function recipeSelected() {
    const requestNumber = ++latestRequest;
    recipeDetails.hidden = true;

    if (!recipeSelect.value) {
        statusElem.textContent = 'Select a recipe to see its picture and ingredients.';
        return;
    }

    statusElem.textContent = 'Loading recipe...';
    try {
        const recipe = await loadJson(recipeSelect.value);
        // Ignore an older response if the user has selected another recipe.
        if (requestNumber !== latestRequest) {
            return;
        }
        displayRecipe(recipe);
    } catch (error) {
        if (requestNumber === latestRequest) {
            statusElem.textContent = error.message;
        }
    }
}

recipeSelect.addEventListener('change', recipeSelected);
await loadRecipeList();
