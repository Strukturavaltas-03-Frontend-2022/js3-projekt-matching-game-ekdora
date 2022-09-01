const imgIdPrefix = 'matching-game__img_'
const board = document.querySelector('#matching-game__board');
const testBtn = document.querySelector('#test');
let cardImgNames = ['apple', 'banana', 'cherry', 'pear', 'watermelon'];
cardImgNames = [...cardImgNames, ...cardImgNames];

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

const createCardElement = (src, alt, idx) => {
    const card = document.createElement('div');
    card.classList.add('flip-card');
    const innerCard = document.createElement('div');
    innerCard.classList.add('flip-card-inner');
    card.appendChild(innerCard);

    const cardFront = document.createElement('div');
    cardFront.classList.add('flip-card-front');
    const cardBack = document.createElement('div');
    cardBack.classList.add('flip-card-back', 'card-back');
    innerCard.appendChild(cardFront);
    innerCard.appendChild(cardBack);

    const cardFrontImgDiv = document.createElement('div');
    cardFrontImgDiv.classList.add('flip-card-front-img', 'flex', 'items-center', 'p-4');
    cardFront.appendChild(cardFrontImgDiv);

    const cardFrontImg = document.createElement('img');
    cardFrontImg.id = `${imgIdPrefix}${alt}${idx}`;
    cardFrontImg.src = src;
    cardFrontImg.alt = alt;
    cardFrontImgDiv.appendChild(cardFrontImg);

    const cardBackBckgr = document.createElement('div');
    cardBackBckgr.classList.add('card-back');
    cardBack.appendChild(cardBackBckgr);

    board.appendChild(card);
};

initBoard = () => {
    shuffle(cardImgNames);
    cardImgNames.forEach((cardImgName, idx) => {
        createCardElement(`assets/images/${cardImgName}.svg`, cardImgName, idx);
    });
}

initBoard();

const allImg = document.querySelectorAll(`[id^='${imgIdPrefix}']`);
const cards = document.querySelectorAll('.flip-card-inner');

testBtn.addEventListener('click', () => {
    shuffle(cardImgNames);
    allImg.forEach((img, idx) => {
        img.src = `assets/images/${cardImgNames[idx]}.svg`;
        img.alt = cardImgNames[idx];
    });
});

let currentFirstSelected = false;
let isBoardLocked = false;
let firstSelectedCard, secondSelectedCard;

const resetBoard = () => {
    [currentFirstSelected, isBoardLocked] = [false, false];
    [firstSelectedCard, secondSelectedCard] = [null, null]; 
}

const disablePair = () => {
    firstSelectedCard.removeEventListener('click', flipCard);
    secondSelectedCard.removeEventListener('click', flipCard);
    resetBoard();
}

const unflipLastTwoCards = () => {
    isBoardLocked = true;
    setTimeout(() => {
        firstSelectedCard.classList.remove('rotate');
        secondSelectedCard.classList.remove('rotate');
        resetBoard();
    }, 1000);
}

const checkForMatch = () => {
    const firstCardAlt = firstSelectedCard.querySelector(`[id^='${imgIdPrefix}']`).alt;
    const secondCardAlt = secondSelectedCard.querySelector(`[id^='${imgIdPrefix}']`).alt;
    firstCardAlt === secondCardAlt ? disablePair() : unflipLastTwoCards();
}

function flipCard() {
    if (!isBoardLocked && this !== firstSelectedCard) {
        this.classList.add('rotate');

        if (!currentFirstSelected) {
            currentFirstSelected = true;
            firstSelectedCard = this;
        } else {
            secondSelectedCard = this;
            checkForMatch();
        }
    }
}

cards.forEach(card => {
    card.addEventListener('click', flipCard);
});