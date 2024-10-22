const modal = document.getElementById("ingredients-modal");
const createRecipeModal = document.getElementById("create-recipe-modal");
const btn = document.getElementById("add-ingredients-btn");
const createRecipeBtn = document.getElementById("create-recipe-btn");
const span = document.getElementsByClassName("close")[0];
const spanCreateRecipe = document.getElementsByClassName("close-create-recipe")[0];
const searchButton = document.getElementById("search-recipes-btn");
const recipeList = document.getElementById("recipe-list");
const ingredientsSelect = document.getElementById("ingredients-select");
const saveRecipeBtn = document.getElementById("save-recipe-btn");
const recipeNameInput = document.getElementById("recipe-name");
const recipeImageInput = document.getElementById("recipe-image");

// Open the ingredients modal
btn.onclick = function() {
    modal.style.display = "block";
    fetchIngredients(); // Fetch ingredients when the modal opens
}

// Open the create recipe modal
createRecipeBtn.onclick = function() {
    createRecipeModal.style.display = "block";
}

// Close the ingredients modal
span.onclick = function() {
    modal.style.display = "none";
}

// Close the create recipe modal
spanCreateRecipe.onclick = function() {
    createRecipeModal.style.display = "none";
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    } else if (event.target === createRecipeModal) {
        createRecipeModal.style.display = "none";
    }
}

// Search recipes when the button is clicked
searchButton.onclick = function() {
    const selectedOptions = Array.from(ingredientsSelect.selectedOptions);
    const ingredients = selectedOptions.map(option => option.value).join(',');

    if (ingredients) {
        fetchRecipes(ingredients);
        modal.style.display = "none";
    }
}

// Function to fetch ingredients from TheMealDB API
async function fetchIngredients() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list"); // TheMealDB ingredient list
        const data = await response.json();
        populateIngredients(data.meals); // Populate the dropdown with fetched ingredients
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    }
}

// Function to populate the dropdown with ingredients
function populateIngredients(ingredients) {
    ingredientsSelect.innerHTML = ""; // Clear existing options
    ingredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient.strIngredient; // Use the ingredient name as the value
        option.textContent = ingredient.strIngredient; // Display the ingredient name
        ingredientsSelect.appendChild(option);
    });
}

// Function to fetch recipes from TheMealDB API
async function fetchRecipes(ingredients) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        const data = await response.json();
        displayRecipes(data.meals); // Display recipes
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    recipeList.innerHTML = "";
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement("div");
            recipeDiv.innerHTML = 
                `<h3>${recipe.strMeal}</h3>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width: 100px; height: auto;">`;
            recipeList.appendChild(recipeDiv);
        });
        // Show the create recipe button after displaying the recipe list
        createRecipeBtn.style.display = "block";
    } else {
        recipeList.innerHTML = "<p>No recipes found.</p>";
        createRecipeBtn.style.display = "none"; // Hide button if no recipes found
    }
}

// Save custom recipe to local storage
saveRecipeBtn.onclick = function() {
    const recipeName = recipeNameInput.value.trim();
    const recipeImageFile = recipeImageInput.files[0]; // Get the uploaded image file

    if (recipeName && recipeImageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            let customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
            customRecipes.push({ name: recipeName, image: event.target.result });
            localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
            alert('Recipe saved successfully!');
            recipeNameInput.value = '';
            recipeImageInput.value = ''; // Clear the image input
            createRecipeModal.style.display = 'none';
            displayCustomRecipes();
        };
        reader.readAsDataURL(recipeImageFile); // Convert image file to base64 string
    } else {
        alert('Please enter a recipe name and upload an image.');
    }
}

// Display custom recipes from local storage
function displayCustomRecipes() {
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    recipeList.innerHTML = ""; // Clear existing recipes to avoid duplicates
    customRecipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.innerHTML = 
            `<h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" style="width: 100px; height: auto;">
            <button class="delete-recipe-btn" data-index="${index}">Delete</button>`;
        recipeList.appendChild(recipeDiv);
    });

    // Add delete functionality to each button
    const deleteButtons = document.querySelectorAll(".delete-recipe-btn");
    deleteButtons.forEach(button => {
        button.onclick = function() {
            const index = this.getAttribute("data-index");
            deleteRecipe(index);
        };
    });
}

// Delete a recipe
function deleteRecipe(index) {
    let customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    customRecipes.splice(index, 1); // Remove the recipe at the specified index
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    displayCustomRecipes(); // Refresh the displayed recipes
}

// Load custom recipes on page load
window.onload = function() {
    displayCustomRecipes();
    createRecipeBtn.style.display = "none"; // Initially hide the create recipe button
}
