const startButton = document.querySelector('button');

let firstCard = null;
let secondCard = null;
let score = 0;
unrevealedCardImg = 'images/cat.png';

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    createGame();
});

async function createGame() {
    try {
        const urlArray = await getUrls(18);
        urlArray.sort(() => 0.5 - Math.random())
        const newGame = new memoryGame(urlArray);
    }
    catch (err) {
        console.log('Error : ', err);
    }
}

async function getUrls(arraySize) {
    const urlArray = [];

    for (let i = 0; i < arraySize; i += 2) {
        const jsonObj = await fetch('https://cataas.com/cat?json=true&width=:100');

        if (!jsonObj.ok)
            throw new Error('request to cataas.com failed');
        const obj = await jsonObj.json();
        urlArray.push('https://cataas.com' + obj.url);
        urlArray.push('https://cataas.com' + obj.url);
    }
    return urlArray;
}

class memoryGame {
    constructor(urlArray) {
        // Score element creation

        const scoreElement = document.createElement('h2');
        scoreElement.textContent = 'Score : ';
        const scoreValueElement = document.createElement('span');
        document.querySelector('main').appendChild(scoreElement);
        scoreElement.appendChild(scoreValueElement);
        scoreValueElement.textContent = score;
        scoreValueElement.setAttribute('id', '#result');

        // Game grid creation

        const newGame = document.createElement('div');
        newGame.classList.add('grid');
        document.querySelector('main').appendChild(newGame);

        // Grid cards creation

        for (let i = 0; i < urlArray.length; i++) {
            const newCard = document.createElement('img');
            newCard.setAttribute('src', unrevealedCardImg);
            newCard.setAttribute('data-id', i);
            newGame.appendChild(newCard);
            newCard.addEventListener('click', () => {
                this.flipCard(newCard, urlArray);
            });
        }
    }

    // Flipping card event

    flipCard(card, urlArray) {
        if (card.getAttribute('src') === 'images/white.png')
            return;
        else if (!firstCard) {
            firstCard = card;
            card.setAttribute('src', urlArray[card.getAttribute('data-id')]);
        }
        else if (card === firstCard) {
            firstCard.setAttribute('src', unrevealedCardImg);
            firstCard = null;
        }
        else if (!secondCard) {
            secondCard = card;
            card.setAttribute('src', urlArray[card.getAttribute('data-id')]);
            setTimeout(this.checkMatch.bind(card, urlArray), 500);
        }
    }

    // Pair check after revealing 2 cards

    checkMatch(urlArray) {
        if (firstCard.getAttribute('src') === secondCard.getAttribute('src')) {
            firstCard.setAttribute('src', 'images/white.png');
            secondCard.setAttribute('src', 'images/white.png');
        }
        else {
            firstCard.setAttribute('src', unrevealedCardImg);
            secondCard.setAttribute('src', unrevealedCardImg);
        }
        firstCard = null;
        secondCard = null;
        score++;
        document.getElementById('#result').textContent = score;
    }
}