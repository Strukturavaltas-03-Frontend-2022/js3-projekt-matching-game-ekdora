const imgIdPrefix = 'matching-game__img_'
const board = document.querySelector('#matching-game__board');
let cardImgNames = ['apple', 'banana', 'cherry', 'pear', 'watermelon'];
cardImgNames = [...cardImgNames, ...cardImgNames];
let cardImgIds = [];

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
    cardBack.classList.add('flip-card-back');
    innerCard.appendChild(cardFront);
    innerCard.appendChild(cardBack);

    const cardFrontImgDiv = document.createElement('div');
    cardFrontImgDiv.classList.add('flip-card-front-img', 'flex', 'items-center');
    cardFront.appendChild(cardFrontImgDiv);

    const cardFrontImg = document.createElement('img');
    cardFrontImg.id = `${imgIdPrefix}${alt}${idx}`;
    cardFrontImg.src = src;
    cardFrontImg.alt = alt;
    cardFrontImgDiv.appendChild(cardFrontImg);

    board.appendChild(card);
};

shuffle(cardImgNames);
cardImgNames.forEach((cardImgName, idx) => {
    createCardElement(`assets/images/${cardImgName}.svg`, cardImgName, idx);
});


const allImg = document.querySelectorAll(`[id^='${imgIdPrefix}']`);
const cards = document.querySelectorAll('.flip-card-inner');

const resetCards = () => {
    cards.forEach(card => {
        card.classList.remove('rotate');
    });
    shuffle(cardImgNames);
    setTimeout(() => { resetImgs(); addClickEventToCards(); }, 100);
}

const resetImgs = () => {
    allImg.forEach((img, idx) => {
        img.src = `assets/images/${cardImgNames[idx]}.svg`;
        img.alt = cardImgNames[idx];
    });
}

let isFirstSelected = false;
let isBoardLocked = false;
let firstSelectedCard, secondSelectedCard;

const resetBoard = () => {
    [isFirstSelected, isBoardLocked] = [false, false];
    [firstSelectedCard, secondSelectedCard] = [null, null];
    if (cardImgIds.length === cardImgNames.length) {
        cardImgIds = [];
        setTimeout(resetCards, 5000);
    }
}

const disablePair = (firstCard, secondCard) => {
    firstSelectedCard.removeEventListener('click', flipCard);
    secondSelectedCard.removeEventListener('click', flipCard);
    cardImgIds.push(firstCard.id, secondCard.id);
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
    const firstCard = firstSelectedCard.querySelector(`[id^='${imgIdPrefix}']`);
    const secondCard = secondSelectedCard.querySelector(`[id^='${imgIdPrefix}']`);
    firstCard.alt === secondCard.alt ? disablePair(firstCard, secondCard) : unflipLastTwoCards();
}

function flipCard() {
    if (!isBoardLocked && this !== firstSelectedCard) {
        this.classList.add('rotate');

        if (!isFirstSelected) {
            isFirstSelected = true;
            firstSelectedCard = this;
        } else {
            secondSelectedCard = this;
            checkForMatch();
        }
    }
}

const addClickEventToCards = () => {
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

addClickEventToCards();