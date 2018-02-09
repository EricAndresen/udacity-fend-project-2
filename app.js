// TODO: flash orange in Failure Handler
// TODO: make easy, medium, hard buttons with number of tries allowed.

//VARIABLES

let attemptCounter =0;

let attemptsDisplay = document.querySelector('#attempts-left');

const cards = document.querySelectorAll('.card');

const cardCanvas = document.querySelector('.card-canvas');

let previousCardIcon = '';

const replayButtons = document.querySelectorAll('.replay');

const stars = document.querySelector('.stars');

const startTime = performance.now();

let successCounter = 0;

// FUNCTIONS

function compareCard(cardElement) {
  //moves to div.card > div.back> i.(class to compare) and sees if classes of both cards match
  let currentCardIcon = cardElement.lastElementChild.firstElementChild
  if (previousCardIcon && currentCardIcon !== previousCardIcon) {
    previousCardIcon.className == currentCardIcon.className ? successHandler(previousCardIcon, currentCardIcon) : failureHandler(previousCardIcon, currentCardIcon);
    //reset after comparison
    previousCardIcon = '';
  } else {
    previousCardIcon = currentCardIcon
  }
}

function failureHandler(...icons) {
  //shake, flip over car
  setTimeout( () => icons.map( i => i.classList.add('shake')), 500);
  setTimeout( () => icons.map( i => {
    let card = i.parentElement.parentElement
    card.style.transform = 'rotateY(360deg)'
    //reset shake
    icons.map( i => i.classList.remove('shake'));
  }), 1500);
  //record failed attempt
  attemptCounter++;

  //update status-bar info
  attemptsDisplay.innerText = `Attempts: ${attemptCounter}`
  updateStars(attemptCounter)
  if (attemptCounter == 25) { loseHandler() }
}

function loseHandler() {
  //fade in lose div
  setTimeout(() => cardCanvas.classList.add('fade-out'), 2000);
  setTimeout(() => {
    cardCanvas.style.display = 'none';
    let lose = document.querySelector('.lose');
    lose.classList.add('fade-in');
    lose.style.display = 'flex';
  } , 3000);
}

function moveToCard(element) {
  //recursively traverse dom tree up to .card element
  const classes = element.classList;
  if (classes.contains('fa') || classes.contains('front')) {
    return moveToCard(element.parentElement); //recursive, so return all the way up function
  } else if (classes.contains('card')) {
    return element;
  }
}

function randomizeCardOrder() {
  // hiding content does not increase performance, so not included
  // cardCanvas.style.display = 'none';
  const randomOrder = [...Array(16).keys()].sort(()=> 0.5 - Math.random());
  //use .call to make map treat nodeList like array
  Array.prototype.map.call(cards, c => c.style.cssText = `order: ${randomOrder.pop()};` )
  // cardCanvas.style.display = 'grid'; //undo hide
}

function rotateCard(cardElement) {
  cardElement.style.transform = 'rotateY(180deg)';
}

function successHandler(...icons) {
  //replace with checkmark and make green
  setTimeout( () => {
      icons.map( i => i.className = 'fa fa-check');
      icons.map( i => i.parentElement.style.backgroundColor = 'yellowgreen');
    }, 500);
  // increment successCounter
  successCounter++
  //win the game if all have been found
  if (successCounter == 8) { winHandler() };
}

function winHandler() {
  //hack to get video to play when win is triggered
  let video = document.querySelector('#win-video')
  video.setAttribute('src','https://player.vimeo.com/video/61875169?autoplay=1&title=0&byline=0&portrait=0#t=18s');

  setTimeout(() => cardCanvas.classList.add('fade-out'), 3000);
  //fade in win div
  setTimeout(() => {
    cardCanvas.style.display = 'none';
    let win = document.querySelector('.win');
    win.classList.add('fade-in');
    win.style.display = 'flex';

    //calculate and display time
    const stopTime = performance.now();
    const totalTime = stopTime - startTime;
    const secs = totalTime / 1000;
    const finalTime = ` ${Math.floor(secs/60)} m ${Math.floor(secs % 60)} s`;
    let time = document.querySelector('.time');
    time.innerText += finalTime;

    //move star rating to win div
    document.querySelector('.fa-refresh').remove()
    document.querySelector('.final-rating').insertBefore(stars, time)
  } , 4000);
}

function updateStars(attemptn) {
  //reduce star count every 5 attempts
  if(attemptn >= 5 && attemptn < 16) {
    let starIndex = Math.floor(attemptn/5) + 1;
    stars.children[starIndex].classList.remove('fa-star');
    stars.children[starIndex].classList.add('fa-star-o');
  }
}

// LOGIC

randomizeCardOrder();

cardCanvas.addEventListener('click', (event) => {
    let currentCard = moveToCard(event.target);
    rotateCard(currentCard);
    compareCard(currentCard);
});

[...replayButtons].forEach(button => button.addEventListener('click', (event) => location.reload()))
