const resultDisplay = document.querySelector('#result');

let firstCard = null;
let secondCard = null;
let score = 0;
unrevealedCardImg = 'images/cat.png';
resultDisplay.textContent = score;

async function getUrls(arraySize) {
    const urlArray = [];

    for (let i = 0; i < arraySize; i += 2) {
        const jsonObj = await fetch('https://cataas.com/cat?json=true');
        const obj = await jsonObj.json();
        urlArray.push('https://cataas.com' + obj.url);
        urlArray.push('https://cataas.com' + obj.url);
    }
    return urlArray;
}

showURL();

async function showURL() {
    try {
        const urlArray = await getUrls(25);
        urlArray.sort(() => 0.5 - Math.random())
        // console.log(urlArray);
        const newGame = new memoryGame(urlArray);
    }
    catch (err) {
        console.log('nnnnnnn', err);
    }
}

class memoryGame {

    constructor(urlArray) {
        this.size = urlArray.length;

        const newGame = document.createElement('div');
        newGame.classList.add('grid');
        document.querySelector('main').appendChild(newGame);

        for (let i = 0; i < urlArray.length; i++) {
            // console.log(urlArray[i]);
            const newCard = document.createElement('img');
            newCard.setAttribute('src', unrevealedCardImg);
            newCard.setAttribute('data-id', i);
            newGame.appendChild(newCard);
            newCard.addEventListener('click', () => {
                this.flipCard(newCard, urlArray);
            });
        }
    }

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
        resultDisplay.textContent = score;
    }
}