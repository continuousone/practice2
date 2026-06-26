const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");


function searchMeal(e) {
  e.preventDefault();
  single_mealEl.innerHTML = "";
  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for <span class="term">${term}</span></h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealid="${meal.idMeal}">
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
function addMealToDOM(meal) {
    mealsEl.style.display = "none";
    resultHeading.style.display = "none";
    const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`);
    }
  }

  single_mealEl.innerHTML = `
    <div class="meal-detail">
      <button id="back-btn" class="back-btn"><i class="fa-solid fa-circle-left"></i>Back</button>

      <h1>${meal.strMeal}</h1>

      <img
        src="${meal.strMealThumb}"
        alt="${meal.strMeal}"
        class="meal-detail-img"
      />

      <div class="meal-meta">
        ${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ""}
      </div>

      <h2>Instructions</h2>
      <p class="instructions">
        ${meal.strInstructions.replace(/\r?\n/g, "<br>")}
      </p>

      <h2>Ingredients</h2>
      <ul class="ingredients-list">
        ${ingredients.map((item) => `<li>${item}</li>`).join("")}
      </ul>

      ${
        meal.strYoutube
          ? `<a href="${meal.strYoutube}" target="_blank" class="video-btn"><i class="fa-brands fa-youtube"></i>Watch Video</a>`
          : ""
      }
    </div>
  `;

  const backBtn = document.getElementById("back-btn");

  backBtn.addEventListener("click", () => {
  single_mealEl.innerHTML = "";

  mealsEl.style.display = "flex"; // or "grid" depending on your CSS
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