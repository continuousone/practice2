const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  drinksEl = document.getElementById("drinks"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

  const heroEl = document.getElementById("hero");
  const mealDayEl = document.getElementById("meal-of-day");


function searchMeal(e) {
  e.preventDefault();
  heroEl.style.display="none";
  mealDayEl.style.display="none"


  single_mealEl.innerHTML = "";
  mealsEl.style.display = "flex";
  resultHeading.style.display = "";
  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for <span class="term mb-8">${term}</span></h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info text-3xl" data-mealid="${meal.idMeal}">
            <h3>${meal.strMeal}</h3></div>
            </div>`
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
async function addMealToDOM(meal) {
  mealsEl.style.display = "none";
  resultHeading.style.display = "none";

const ingredients = [];

for (let i = 1; i <= 20; i++) {
  const ingredient = meal[`strIngredient${i}`];
  const measure = meal[`strMeasure${i}`];

  if (ingredient && ingredient.trim() !== "") {
    ingredients.push({
      measure: measure ? measure.trim() : "",
      ingredient: ingredient.trim()
    });
  }
}

  const drinkRes = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const drinkData = await drinkRes.json();
  const drink = drinkData.drinks[0];

  const drinkIngredients = [];

  for (let i = 1; i <= 20; i++) {
    const drinkIngredient = drink[`strIngredient${i}`];
    const drinkMeasure = drink[`strMeasure${i}`];

    if (drinkIngredient && drinkIngredient.trim() !== "") {
      drinkIngredients.push(`${drinkMeasure ? drinkMeasure.trim() : ""} ${drinkIngredient.trim()}`);
    }
  }

  single_mealEl.innerHTML = `
    <div class="meal-detail">
      <button id="back-btn" class="back-btn text-xs">
        <i class="fa-solid fa-circle-left"></i>Back
      </button>

      <h1 class="name text-red-600 text-3xl font-semibold">${meal.strMeal}</h1>

      <img
        src="${meal.strMealThumb}"
        alt="${meal.strMeal}"
        class="meal-detail-img rounded-lg mx-auto"
      />

      <div class="meal-meta">
        ${meal.strCategory ? `<h4 class="mt-4 mb-2"><strong class="text-red-600 ">Category</strong> <br>${meal.strCategory}</h4>` : ""}
        ${meal.strArea ? `<h4 class="mb-4"><strong class="text-red-600">Ethnicity</strong><br> ${meal.strArea}</h4>` : ""}
      </div>

      <h2 class="text-2xl font-semibold text-red-600">Instructions</h2>
      <p class="instructions text-lg font-normal mt-4 mb-2">
        ${meal.strInstructions.replace(/\r?\n/g, "<br>")}

      </p>

      <h2 class="text-2xl font-semibold p-8 text-red-600">Ingredients</h2>
      <ul class="ingredients-list">
        ${ingredients
          .map(
            (item) => `
              <li>
                <span class="measure">${item.measure}</span>
                <span class="ingredient">${item.ingredient}</span>
              </li>
            `
          )
          .join("")}
      </ul>

      ${
        meal.strYoutube
          ? `<a href="${meal.strYoutube}" target="_blank" class="video-btn">
              <i class="fa-brands fa-youtube"></i>Watch Video
            </a>`
          : ""
      }

      <div class="drink-section">
        <div>
          <h3 class="font-bold">Suggested Drink</h3>
          <h2 class="name">${drink.strDrink}</h2>
          <h3 class="font-bold pb-4">Ingredients</h3>
      <ul class="ingredients-list">
        ${drinkIngredients.map((item) => `<li>${item}</li>`).join("")}
      </ul>
        </div>
        <img
          src="${drink.strDrinkThumb}"
          alt="${drink.strDrink}"
          class="drink-img mt-4"

        />
      </div>
    </div>
  `;

  const backBtn = document.getElementById("back-btn");

  backBtn.addEventListener("click", () => {
    single_mealEl.innerHTML = "";

    mealsEl.style.display = "flex";
    resultHeading.style.display = "";
  });
}
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.target.closest(".meal-info");

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
// window.addEventListener("DOMContentLoaded", () => {
//   getRandomMeal();
// });
// getRandomMeal();