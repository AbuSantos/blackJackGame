/** @format */

let blackJackGame = {
  you: { scoreSpan: "#yourBlackJackResult", div: "#yourBox", score: 0 },
  dealer: { scoreSpan: "#dealerBlackJackResult", div: "#dealerBox", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];

//assigning the audio vairables
const hitSound = new Audio("images/sounds/swish.m4a");
const winAudio = new Audio("images/sounds/cash.mp3");
const lossSound = new Audio("images/sounds/aww.mp3");

//adding evernt listeners
document
  .querySelector("#blackJack-HitButton")
  .addEventListener("click", blackJackHit);
document
  .querySelector("#blackJack-StandButton")
  .addEventListener("click", dealerLogic);
document
  .querySelector("#blackJack-DealButton")
  .addEventListener("click", blackJackDeal);

//the hit button
const blackJackHit = () => {
  //making the button disabled when the dealer is playing
  if (blackJackGame["isStand"] === false) {
    //getting the random card from the random function
    let card = randomCard();
    // console.log(card);

    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
};

//getting a random card from the blackjack cards object
const randomCard = () => {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame["cards"][randomIndex];
};

//displaying the card on tge UI
const showCard = (card, activePlayer) => {
  if (activePlayer["score"] <= 21) {
    //creating the card element
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;

    //appending the cardimage element to the active player UI
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
};

// Deal Button removing the entire decks
const blackJackDeal = () => {
  if (blackJackGame["turnsOver"] === true) {
    blackJackGame["isStand"] = false;
    let yourImages = document.querySelector("#yourBox").querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealerBox")
      .querySelectorAll("img");

    //deleting the images from the player box
    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    //deleting the images from the player box
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    // reset the score
    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#yourBlackJackResult").textContent = 0;
    document.querySelector("#dealerBlackJackResult").textContent = 0;

    document.querySelector("#yourBlackJackResult").style.color = "#ffffff";
    document.querySelector("#dealerBlackJackResult").style.color = "#ffffff";

    document.querySelector("#blackJackResult").textContent = "Let's Play";
    document.querySelector("#blackJackResult").style.color = "black";
    blackJackGame["turnsOver"] = true;
  }
};

const updateScore = (card, activePlayer) => {
  //A card has two value, so selecting either not to overshoot the user score
  if (card === "A") {
    //if adding 11 keeps me below 21, add 11. otherwise,add 1
    if (activePlayer["score"] + blackJackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackJackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackJackGame["cardsMap"][card][0];
    }
  } else {
    //else just add the scores if the card isnt A
    activePlayer["score"] += blackJackGame["cardsMap"][card];
  }
};

//show the scores on the You and Dealer Span
const showScore = (activePlayer) => {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "Bust!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
};
// making the bot dealer function play automatically
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function dealerLogic() {
  blackJackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackJackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }
  blackJackGame["turnsOver"] = true;
  let winner = computeWinner();
  showResults(winner);
}

//compute winnner and return winner
//update wins, draws and losses
const computeWinner = () => {
  let winner;
  if (YOU["score"] <= 21) {
    //condition; higher score than dealer or when dealer bursts but youre under 21

    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackJackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackJackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackJackGame["draws"]++;
    }
    //condition: when user burst and dealer doesnt
    else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
      blackJackGame["losses"]++;
      winner = DEALER;
    }
    //condition: when you and the dealer bursts
    else if (YOU["score"] > 21 && DEALER["score"] > 21) {
      blackJackGame["draws"]++;
    }
  }
  console.log(blackJackGame);
  return winner;
};

const showResults = (winner) => {
  let message, messageColor;
  if (blackJackGame["turnsOver"] === true) {
    if (winner === YOU) {
      document.querySelector("#blackJackWins").textContent =
        blackJackGame["wins"];
      message = "You Won!";
      messageColor = "green";
      winAudio.play();
    } else if (winner === DEALER) {
      document.querySelector("#blackJackLosses").textContent =
        blackJackGame["losses"];
      message = "You Lost";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#blackJackDraws").textContent =
        blackJackGame["draws"];
      message = "You Drew";
      messageColor = "black";
    }

    document.querySelector("#blackJackResult").textContent = message;
    document.querySelector("#blackJackResult").style.color = messageColor;
  }
};
