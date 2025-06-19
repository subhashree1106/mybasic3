let recipes = [];

document.addEventListener("DOMContentLoaded", () => {
  // Load recipes from local storage
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes = savedRecipes;
  displayRecipes(recipes);

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").textContent = "☀️ Light Mode";
  }

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.getElementById("theme-toggle").textContent = isDark ? "☀️ Light Mode" : "🌙 Toggle Theme";
  });
});

// Add Recipe
document.getElementById("add-recipe-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("recipe-name").value.trim();
  const ingredients = document.getElementById("recipe-ingredients").value.trim();
  const steps = document.getElementById("recipe-steps").value.trim();
  const imageInput = document.getElementById("recipe-image");

  if (!name || !ingredients || !steps || !imageInput.files.length) {
    alert("Please fill all fields and upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const newRecipe = {
      name,
      ingredients,
      steps,
      imageUrl: reader.result,
    };
    recipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes(recipes);
    document.getElementById("add-recipe-form").reset();
    imageInput.value = "";
  };
  reader.readAsDataURL(imageInput.files[0]);
});

// Display Recipes
function displayRecipes(recipeArray) {
  const container = document.getElementById("recipes-container");
  container.innerHTML = "";

  recipeArray.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.name}" />
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps.substring(0, 60)}...</p>
    `;
    card.addEventListener("click", () => showRecipeModal(recipe));
    container.appendChild(card);
  });
}

// Search Recipes
document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(query) || r.ingredients.toLowerCase().includes(query)
  );
  displayRecipes(filtered);
});

// Drag & Drop Upload
const dropZone = document.getElementById("drop-zone");
const imageInput = document.getElementById("recipe-image");

dropZone.addEventListener("click", () => imageInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (e.dataTransfer.files.length) {
    imageInput.files = e.dataTransfer.files;
  }
});

// Modal Functions
function showRecipeModal(recipe) {
  const modal = document.getElementById("recipe-modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.imageUrl}" style="width:100%; border-radius:12px;" />
    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
    <p><strong>Preparation Steps:</strong> ${recipe.steps}</p>
  `;

  modal.classList.add("show");
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("recipe-modal").classList.remove("show");
});

  