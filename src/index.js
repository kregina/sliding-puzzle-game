import style from './main.css';

const root = document.querySelector(':root');
const gameArea = document.getElementById('ulSliding');
const startButton = document.getElementById('start');
const solveButton = document.getElementById('solve');
const shuffleButton = document.getElementById('shuffle');
const fabButton = document.getElementById('fabButton');
const settingsButton = document.getElementById('settings');
const sheetList = document.getElementById('sheetList');
const fabList = document.getElementById('fabList');
const divWon = document.getElementById('divWon');
const movesDisplay = document.getElementById('movesDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const sizeRange = document.getElementById('size');
const dificultyRange = document.getElementById('dificult');
const applyButton = document.getElementById('apply');
const sizeLabel = document.getElementById('sizeLabel');
const dificultyLabel = document.getElementById('dificultyLabel');

let size = 4;
let dificulty = 5;
let moves;
let movesCount;
let timer;
let startDate;
let dateIntervalId;
let tiles;
let blank;
root.style.setProperty('--matrix-order', size);

startButton.onclick = startGame;
solveButton.onclick = solve;
shuffleButton.onclick = shuffle;
fabButton.onclick = toggleFabList;
settingsButton.onclick = toggleSettings;

sizeRange.addEventListener('input', e => {
  size = e.target.value;
  sizeLabel.innerText = size;
});

dificultyRange.addEventListener('input', e => {
  dificulty = e.target.value;
  dificultyLabel.innerText = dificulty;
});

applyButton.addEventListener('click', e => {
  bootstrap();
  sheetList.classList.toggle('open');
});

bootstrap();

function bootstrap() {
  tiles = createTiles(size);
  blank = tiles[tiles.length - 1];
  blank.className = 'blank';

  startGame();

	const fragment = tiles.reduce((fragment, element) => {
	  fragment.appendChild(element);
	  return fragment;
	}, document.createDocumentFragment());

	gameArea.appendChild(fragment);
}

function startGame() {
  moves = [];
  movesCount = 0;
  startDate = new Date();
  dateIntervalId = setInterval(updateTimer, 100);

  ulSliding.classList.remove('win');

  blank.style.visibility = 'hidden';
  divWon.style.display = 'none';

  startButton.style.display = 'none';
  shuffleButton.style.display = 'flex';
  solveButton.style.display = 'flex';

  shuffle(dificulty);
  updateMoveCount();
}

function toggleSettings() {
  sheetList.classList.toggle('open');
}

function toggleFabList() {
  fabList.classList.toggle('open');
}

function tileClicked(e) {
  if (canMove(e.target)) {
    move(e.target);
    updateMoveCount();
    checkWin();
  }
}

function checkWin() {
  const tileStatuses = tiles
    .map(checkTileWin)
    .map((win, i) => [win, tiles[i]]);

  tileStatuses.forEach(([win, tile]) => tile.classList.toggle('win', win));

  const playerWon = tileStatuses.every(([win]) => win);

  if (playerWon) {
    endGame();
  }
}

function endGame() {
  clearInterval(dateIntervalId);

  ulSliding.classList.add('win');

  blank.style.visibility = 'visible';

  divWon.style.display = 'flex';
  divWon.style.visibility = 'visible';

  startButton.style.display = 'flex';
  shuffleButton.style.display = 'none';
  solveButton.style.display = 'none';
}


function checkTileWin(el) {
  return el.style.getPropertyValue('--col') === el.style.getPropertyValue('--start-col')
    && el.style.getPropertyValue('--row') === el.style.getPropertyValue('--start-row')
}

function shuffle() {
  for (let i = 0; i < dificulty; i++) {
    const availableMoves = tiles
      .filter(canMove)
      .filter(notEqualToLastMove);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const randomTile = availableMoves[randomIndex];
    move(randomTile);
  }
  checkWin();
}

function solve() {
  let tile;
  while ((tile = moves.pop())) {
    swap(tile, blank);
  }
  checkWin();
}

function move(target) {
  swap(target, blank);
  moves.push(target);
}

function canMove(target) {
  const deltaX = Math.abs(target.style.getPropertyValue('--col') - blank.style.getPropertyValue('--col'));
  const deltaY = Math.abs(target.style.getPropertyValue('--row') - blank.style.getPropertyValue('--row'));
  const delta = deltaX + deltaY;
  return delta === 1;
}

function notEqualToLastMove(tile) {
  return tile !== moves[moves.length - 1];
}

function swap(...tiles) {
  tiles
    .map((el, i) => [
      tiles.length - 1 - i,
      el.style.getPropertyValue('--row'),
      el.style.getPropertyValue('--col')
    ])
    .forEach(([opositeIndex, row, col]) => {
      tiles[opositeIndex].style.setProperty('--row', row);
      tiles[opositeIndex].style.setProperty('--col', col);
    });
}

function createTiles(size) {
  const elements = new Array(Math.pow(size, 2));
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const element = document.createElement('li');

      element.style.setProperty('--start-row', row);
      element.style.setProperty('--start-col', col);
      element.style.setProperty('--row', row);
      element.style.setProperty('--col', col);

      element.onclick = tileClicked;

      elements.push(element);
    }
  }
  return elements;
}

function updateTimer() {
  timer = new Date().getTime() - startDate.getTime();
  let hundredSeconds = Math.floor( (timer/10) % 100 ).toString().padStart(2, "0");
  let seconds = Math.floor( (timer/1000) % 60 ).toString().padStart(2, "0");
  let minutes = Math.floor( (timer/1000/60) % 60 ).toString().padStart(2, "0");
  let display = `${minutes}:${seconds}:${hundredSeconds}`;
  timerDisplay.innerHTML = display;
}

function updateMoveCount() {
  movesDisplay.innerHTML = movesCount++;
}