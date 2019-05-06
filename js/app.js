/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * Setting timer to allow HTML to load first before calling on the funtion that generates the game
 */
setTimeout(generateGame, 0);
const fragment = document.createDocumentFragment();
const cardImages = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb','fa-bomb'
];
let ActiveCards = [];
let movesCount = 0;
let MaxStars = 12 //12 moves is the starting point for losing stars
const Timer = new PlayTimer();
let matchedCards = 0;
function generateGame() {
    const div = document.createElement('div');
    /*The html below is the header information*/
    let htmlText = `
        <header>
        <h1> Matching Game</h1>
        <div id="timerClock">00 : 00 . 000</div>
        </header>
        <section class="score-panel">
            <ul class="stars">
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
            </ul>
            <span class="moves">0</span> Moves
            <div class="restart">
                <i class="fa fa-repeat"></i>
            </div>
        </section>`;
    div.className = 'container';
    div.innerHTML = htmlText;
    fragment.appendChild(div);
    /*these element variables will be recycled to generate all element needed by the cards*/
    let element = document.createElement('ul');
    let subElement1;
    let subElement2;
    element.className = 'deck';

    for (let index in shuffle(cardImages)) {
        subElement1 = document.createElement('li');
        subElement2 = document.createElement('i');
        subElement1.className = 'card';
        subElement2.className = `fa ${cardImages[index]}`;
        subElement1.appendChild(subElement2);
        element.appendChild(subElement1);
    }
    div.appendChild(element);
      
    //element.addEventListener('click', onClick);
    document.body.appendChild(fragment);

    addClickListenerNow();
};

function cardsMatching(card1, card2) {
    setTimeout(function cardsMatching() {
        if (card1.firstElementChild.className == card2.firstElementChild.className) {
            card1.classList.add('match')
            card2.classList.add('match')
            matchedCards++;
            if (matchedCards == 8) {
                Timer.stop();
            };
        } else {
            ActiveCards.forEach(function (ActiveCard) {
                ActiveCard.classList.remove('open', 'show');
            });}
        ActiveCards.length = 0;
    }, 500);
}
function addClickListenerNow() {
    const allcards = document.querySelectorAll('.card');
    let card1;
    let card2;
    
    const moves = document.querySelector('.moves')
    
    allcards.forEach(function (card) {
        card.addEventListener('click', function (e) {

            let cardNotFlipped = false;
            Timer.start();

            if (card.className == 'card') {
                ActiveCards.push(card);
            } else { console.log('clicked an invalid card');}
            if (matchedCards < 8) {
                switch (ActiveCards[0]) {
                    //Ignore clicking the same card
                    case ActiveCards[1]:
                        console.log('clicked an invalid card');
                        ActiveCards.splice(1, 1);
                        break;
                    default:
                        if (ActiveCards[1] != null) {
                            console.log('second card was not null')
                                movesCount++;
                                moves.textContent = movesCount;
                                removeStars(movesCount);
                        }
                        if (ActiveCards[0].className == 'card') {
                            cardNotFlipped = true;
                            if (cardNotFlipped) {
                                card.classList.add('open', 'show');
                                console.log('flipped card')
                            }
                        }
                        if (ActiveCards.length >= 2) {
                            if (ActiveCards[1].className == 'card') {
                                cardNotFlipped = true;
                                if (cardNotFlipped) {
                                    card.classList.add('open', 'show');
                                    card1 = ActiveCards[0];
                                    card2 = ActiveCards[1];
                                    cardsMatching(card1, card2);
                                }
                            }
                        }
                };
            }

        

            //if (ActiveCards.length >= 2) {
            //    //Keep
            //    card1 = ActiveCards[0];
            //    card2 = ActiveCards[1];

               
            
            //    if (card1.firstElementChild.className == card2.firstElementChild.className) {
            //        card1.classList.add('match')
            //        card2.classList.add('match')
            //        matchedCards++;
            //        if (matchedCards == 8) {
            //            Timer.stop();
            //        };
            //    };
            //    //hide
            //    ActiveCards.forEach(function (ActiveCard) {
            //        ActiveCard.classList.remove('open', 'show');
            //    });
            //    ActiveCards.length = 0;
            //}
            //else {
            //    card.classList.add('open', 'show');
            //    ActiveCards.push(card);
            //    //setTimeout(cardsMatching(card1, card2), 0);
            //    if (matchedCards < 8) {
            //        switch (ActiveCards[0]) {
            //            //Ignore clicking the same card
            //            case ActiveCards[1]:
            //                console.log('clicked the same card');
            //                ActiveCards.splice(1, 1);
            //                break;
            //            default:
            //                movesCount++;
            //                moves.textContent = movesCount;
            //                removeStars(movesCount);
            //                Timer.start();
            //        };
            //    } 
                
            //}
        });
    });
    document.querySelector('.restart').addEventListener('click', function (e) {
        console.log('clicked restart');
    })
    
};
function removeStars(movesCount) {
    const Star = document.querySelector('.fa-star');
    
    if (movesCount == MaxStars) {
        Star.parentNode.removeChild(Star);
        MaxStars += 4;

        

    };
    //console.log(`moves = ${movesCount} and stars drop point ${MaxStars}`)
};

// The timer functionality is stored here.  An oject needs to be made with these functions for the timer to work
function PlayTimer() {

    let time = 0;
    let interval;
    let offset;

    function update() {
        time += delta();
        let formattedTime = timerFormatter(time);

        document.querySelector('#timerClock').textContent = formattedTime;
        //console.log(formattedTime);
    };
    function delta() {
        let now = Date.now();
        let timeLapsed = now - offset;
        offset = now;
        return timeLapsed;
    };
    function timerFormatter(timeInMilliSeconds) {
        let time = new Date(timeInMilliSeconds);
        let minutes = time.getMinutes().toString();
        let seconds = time.getSeconds().toString();
        let milliseconds = time.getMilliseconds().toString();

        if (minutes.length < 2) {
            minutes = `0${minutes}`;
        };
        if (seconds.length < 2) {
            seconds = `0${seconds}`;
        };
        while (milliseconds.length < 3) {
            milliseconds = `0${milliseconds}`;
        };


        return `${minutes} : ${seconds} . ${milliseconds}`;
    };
    this.isRunning = false;
    this.start = function () {
        if (!this.isRunning) {
            interval = setInterval(update, 10);
            offset = Date.now();
            this.isRunning = true;
        }
    };
    this.stop = function () {
        if (this.isRunning) {
            clearInterval(interval);
            interval = null;
            this.isRunning = false;
        }
    };
    this.reset = function () {
        time = 0;
    };
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
