"use strict"; // I think I read that this helps make errors more visible? or specific?

const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

// I have absolutely no idea why placing this above other let statements finally let me use it in my addEventListener
let handleCardClick = function (evt){  
  if(evt.target.style.backgroundColor == "grey"){
    flipCard(evt);
  }
  else if(evt.target.dataset.choice != undefined){ // allows me to ignore if a user tries to match a tile with itself
    if(evt.target.dataset.choice === "first"){
      return;
    }
  }
  else if(evt.target.style.backgroundColor != "grey"){
    unFlipCard(evt);
  }      
}

// global variables for game logic
let stopClicks = false; // Prevents the user from clicking more than two cards at a time and crashing our logic if true
let haveFlippedTheFirstCard = false; // tracks whether or not we're on the first or second card based on false or true
let firstCard = undefined; // initializing firstCard for tracking in various functions
let secondCard = undefined; // initializing secondCard for tracking in various functions

createCards(colors);

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {

    const div = document.createElement("div");
    div.setAttribute("class",color)

    div.addEventListener("click", handleCardClick) // switched from anon function to named so I can use removeEventListener

    div.style.backgroundColor = "grey";
    gameBoard.append(div);
  }
}

function flipCard(card) {
  if(stopClicks){ // keeps the user from spamming clicks by toggling this until our flips/unflips have run
    return;
  }
  
  const trueColor = card.target.className // for some reason need to store this as a variable
  card.target.style.backgroundColor = trueColor;

  if(!haveFlippedTheFirstCard){ //this contains logic for the first card we are flipping
    haveFlippedTheFirstCard = true; // will indicate that the second card is ready to be tracked when flipped

    firstCard = card.target;
    firstCard.dataset.choice = "first";
  }
  else{ //this contains logic for the second card we are flipping
    stopClicks = true;
    haveFlippedTheFirstCard = false; // will reset the tracking of flipped cards.
    secondCard = card.target;

    if(firstCard.style.backgroundColor === secondCard.style.backgroundColor){
      console.log("Match!");
      // remove the event listeners to keep the match permanently on the screen
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      stopClicks = false;
    }
    else{
      console.log("Not this time. No match.")
      setTimeout(() => {
        unFlipCard(firstCard);
        unFlipCard(secondCard);
        stopClicks = false; // allows the user to interact again
        firstCard.dataset.choice = "";
      }, 1000); // allows the user to see a failed match
    }
  }
}

function unFlipCard(card) {
  card.style.backgroundColor = "grey";
}