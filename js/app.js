/*
 * Hello and welcome to the game.
 * The game is loaded from a Document Fragment that is called on by the first set timer on this document
 */
setTimeout(generateGame, 0);
const fragment = document.createDocumentFragment();
/*
 * Card Images array holds all images used
 */
const cardImages = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'
];

let ActiveCards = [];
let movesCount = 0;
let MaxStars = 12; //12 moves is the starting point for losing stars
let dificulty = 2; //dificulty is a ment to be an easy to find setting.  Once the original 12 moves are exeeded, than this number helps determine when the next star drops
const Timer = new PlayTimer();
let matchedCards = 0;
let TimeForPoints;

/*
 * This function generates most aspects of the game
 */
function generateGame() {
    const div = document.createElement('div');
    /*The html below is the header information*/
    let htmlText = `
        <header>
        <h1>Matching Game</h1>
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
        </section>
    <!-- Modal -->
    <div class="modal fade" id="WinModal" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="ModalLongTitle">Congratulatins!!</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button onclick="resetGame()" class="btn btn-primary" >Restart</button>
                </div>
            </div>
        </div>
    </div>`;
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

    document.body.appendChild(fragment);

    addClickListenerNow();
};
function addClickListenerNow() {
    const allcards = document.querySelectorAll('.card');
    let card1;
    let card2;
    const moves = document.querySelector('.moves')

    allcards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            let cardNotFlipped = false;

            if (card.className == 'card') {
                ActiveCards.push(card);
            } //else { console.log('clicked an invalid card');}
            if (matchedCards < 8) {
                Timer.start();
                switch (ActiveCards[0]) {
                    //Ignore clicking the same card
                    case ActiveCards[1]:
                        //console.log('clicked an invalid card');
                        ActiveCards.splice(1, 1);
                        break;
                    default:
                        if (ActiveCards[1] != null) {
                            //console.log('second card was not null')
                            movesCount++;
                            moves.textContent = movesCount;
                            removeStars(movesCount);
                        }
                        if (ActiveCards[0].className == 'card') {
                            cardNotFlipped = true;
                            if (cardNotFlipped) {
                                card.classList.add('open', 'show');
                                //console.log('flipped card')
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
        });
    });
    document.querySelector('.restart').addEventListener('click', function (e) {
        resetGame();
        //console.log('clicked restart');
    })
};
/*
 *Card Matching function was seperated on its own to help with troubleshooting
 */
function cardsMatching(card1, card2) {
    setTimeout(function cardsMatching() {
        if (card1.firstElementChild.className == card2.firstElementChild.className) {
            card1.classList.add('match')
            card2.classList.add('match')
            matchedCards++;
            if (matchedCards == 8) {
                Timer.stop();
                winner();
            };
        } else {
            ActiveCards.forEach(function (ActiveCard) {
                ActiveCard.classList.remove('open', 'show');
            });
        }
        ActiveCards.length = 0;
    }, 500);
}
function removeStars(movesCount) {
    const Star = document.querySelector('.fa-star');

    if (movesCount == MaxStars) {
        Star.parentNode.removeChild(Star);
        MaxStars += dificulty;
    };
};
function resetGame() {
    let game = document.querySelector('.container');
    const modal = document.querySelector('#WinModal');
    if (modal.style.display == "block") {
        $('#WinModal').modal('toggle');
    }
    Timer.stop();
    Timer.reset();
    movesCount = 0;
    matchedCards = 0;
    ActiveCards.length = 0;
    game.parentNode.removeChild(game);
    setTimeout(generateGame, 0);
}
/* The timer functionality is stored here.
 * An oject needs to be made with this functions for the timer to work.
*/
function PlayTimer() {
    let TotalTimeLapsed = 0;
    let intervalTimer;
    let startTime;

    function RunUpdate() {
        TotalTimeLapsed += ChangeInTime();
        let formattedTime = FormatterForTime(TotalTimeLapsed);

        document.querySelector('#timerClock').textContent = formattedTime;
        TimeForPoints = TotalTimeLapsed;
        //console.log(formattedTime);
    };
    function ChangeInTime() {
        let now = Date.now();
        let timeLapsed = now - startTime;
        startTime = now;
        return timeLapsed;
    };
    function FormatterForTime(timeInMilliSeconds) {
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
            intervalTimer = setInterval(RunUpdate, 10);
            startTime = Date.now();
            this.isRunning = true;
        }
    };
    this.stop = function () {
        if (this.isRunning) {
            clearInterval(intervalTimer);
            intervalTimer = null;
            this.isRunning = false;
        }
    };
    this.reset = function () {
        TotalTimeLapsed = 0;
    };
};
function winner() {
    let FinalStars = document.querySelector('.stars');
    let modalItem = document.querySelector('.modal-body');
    let FinalTime = document.querySelector('#timerClock').textContent;
    let PointsEarned = (FinalStars.childElementCount * 20000) / TimeForPoints; //This formala helps points be readable

    modalItem.innerHTML = `
<h5>Score:</h5>
${FinalStars.outerHTML}
${FinalTime}
<p>Points:  </p>${PointsEarned}`;
    modalItem.classList.add('score-panel');
    $('#WinModal').modal('toggle');
};
/* Shuffle function from http://stackoverflow.com/a/2450976
 * Code for Shuffle provided by Udacity
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}