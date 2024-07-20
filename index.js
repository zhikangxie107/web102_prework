/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    // create a new div element, which will become the game card
    const gameCard = document.createElement("div");

    // add the class game-card to the list
    gameCard.classList.add("game-card");

    // set the inner HTML using a template literal to display some info
    // about each game
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")
    const gameImage = game.img;
    const gameName = game.name;
    const gameDescript = game.description;
    const gameCardTemplate = `<img class="game-img" src=${gameImage} alt="gameimage" />
    <h1>${gameName} </h1>
    <p>${gameDescript} </p>`;

    gameCard.innerHTML = gameCardTemplate;

    //extra info
    const gamePledged = game.pledged;
    const gameGoal = game.goal;
    const gameBackers = game.backers;

    gameCard.addEventListener("click", () => {
      showPopup(
        gameName,
        gameDescript,
        gamePledged,
        gameGoal,
        gameBackers,
        gameImage
      );
    });

    // append the game to the games-container
    const gamesContainer = document.getElementById("games-container");
    gamesContainer.appendChild(gameCard);
  }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acum, game) => {
  return acum + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas

contributionsCard.innerHTML = `<h4>${totalContributions.toLocaleString(
  "en-US"
)}</h4>`;
// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalPledged = GAMES_JSON.reduce((acum, game) => {
  return acum + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<h4>$${totalPledged.toLocaleString("en-US")}</h4>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acum, game) => {
  return acum + 1;
}, 0);

gamesCard.innerHTML = `<h4>${totalGames.toLocaleString("en-US")}</h4>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  let unfundedGames = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
  });

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  let fundedGames = GAMES_JSON.filter((game) => {
    return game.pledged >= game.goal;
  });

  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGames);
}

filterFundedOnly();

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames_amt = GAMES_JSON.reduce((acc, game) => {
  return (acc += game.pledged < game.goal ? 1 : 0);
}, 0);
// create a string that explains the number of unfunded games using the ternary operator
const displayStr =
  unfundedGames_amt <= 1
    ? `A total of $${totalPledged.toLocaleString(
        "en-US"
      )} has been raised for ${totalGames}. Currently, 1 game remains unfunded. We need your help to fund these amazing games!`
    : `A total of $${totalPledged.toLocaleString(
        "en-US"
      )} has been raised for ${totalGames}. Currently, ${unfundedGames_amt} games remains unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const description = document.createElement("p");
description.innerHTML = displayStr;

descriptionContainer.appendChild(description);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;
console.log(firstGame);
console.log(secondGame);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const fundedGame01 = document.createElement("p");
fundedGame01.innerHTML = firstGame.name;
firstGameContainer.appendChild(fundedGame01);
// do the same for the runner up item
const fundedGame02 = document.createElement("p");
fundedGame02.innerHTML = secondGame.name;
secondGameContainer.appendChild(fundedGame02);

//bonus feature
//create a pop up showing more detail information on each game
function showPopup(name, description, pledged, goal, backers, image) {
  console.log("pop up function runs");
  const popup = document.getElementById("game-popup");
  const popupContent = document.getElementById("popup-content");

  let template = `<span class="close-button">&times;</span>
                    <img src=${image} class="game-img" id="popup-img" /> 
                    <h1 id="popup-title">${name} </h1> 
                    <p id="popup-description">${description}</p>
                    <p id="popup-pledged">Amount Pledged: $${pledged.toLocaleString(
                      "en-us"
                    )}</p>
                    <p id="popup-goal">Goal: $${goal.toLocaleString(
                      "en-us"
                    )}</p>
                    <p id="popup-backers">Contributors: ${backers}</p>`;

  //show amount left to reach goal if the amount pledged is less than the goal
  const desireAmount = goal - pledged;
  template +=
    pledged < goal
      ? `<p id="popup-left">$${desireAmount.toLocaleString(
          "en-us"
        )} to reach the goal! </p>`
      : ``;

  popupContent.innerHTML = template;

  popup.classList.remove("hidden");
  popup.style.display = "block";

  const closeButton = document.querySelector(".close-button");

  closeButton.addEventListener("click", () => {
    popup.classList.add("hidden");
    popup.style.display = "none";
  });
}
