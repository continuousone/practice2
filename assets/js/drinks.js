

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.drinks[0].strDrink)
        document.getElementById("drinks").innerHTML = `
        <h1> Suggested Drink <br>${data.drinks[0].strDrink}</h1>
        <img src="${data.drinks[0].strDrinkThumb}">
        `
    });
