import style from './main.css';

const root = document.querySelector(':root');

const overlay = document.getElementById('overlay');

const gameArea = document.getElementById('gameArea');
const sheetList = document.getElementById('sheetList');
const fabList = document.getElementById('fabList');
const divWon = document.getElementById('divWon');

const startButton = document.getElementById('start');
const solveButton = document.getElementById('solve');
const shuffleButton = document.getElementById('shuffle');
const fabButton = document.getElementById('fabButton');
const settingsButton = document.getElementById('settings');

const sizeLabel = document.getElementById('sizeLabel');
const sizeInput = document.getElementById('size');
const dificultyLabel = document.getElementById('dificultyLabel');
const dificultyInput = document.getElementById('dificult');
const movesLabel = document.getElementById('movesDisplay');
const timerLabel = document.getElementById('timerDisplay');

solveButton.onclick = solve;
shuffleButton.onclick = shuffle;
fabButton.onclick = toggleFabList;
settingsButton.onclick = toggleSettings;
sizeInput.oninput = updateSize;
dificultyInput.oninput = updateDificulty;
gameArea.onclick = tileClicked;
startButton.onclick = startGameClicked;
overlay.onclick = toggleSettings

let size = 4;
let dificulty = 5;
let moves;
let movesCount;
let timer;
let startDate;
let dateIntervalId;
let tiles;
let blank;
let settingsChanged = false;

bootstrap();

function bootstrap() {
  tiles = createTiles(size);
  blank = tiles[tiles.length - 1];
  blank.className = 'blank';
  root.style.setProperty('--matrix-order', size);

  startGame();

	const fragment = tiles.reduce((fragment, element) => {
	  fragment.appendChild(element);
	  return fragment;
	}, document.createDocumentFragment());

  gameArea.innerHTML = '';
	gameArea.appendChild(fragment);
}

function startGame() {
  moves = [];
  movesCount = 0;
  startDate = new Date();
  clearInterval(dateIntervalId);
  dateIntervalId = setInterval(updateTimer, 100);

  gameArea.classList.remove('win');

  blank.style.visibility = 'hidden';
  divWon.style.display = 'none';

  startButton.style.display = 'none';
  shuffleButton.style.display = 'flex';
  solveButton.style.display = 'flex';

  shuffle(dificulty);
  updateMoveCount();
}

function startGameClicked() {
  sheetList.classList.toggle('open', false);
  overlay.style.display = 'none';
  if(settingsChanged) {
    settingsChanged = false;
    bootstrap();
  } else {
    startGame();
  }
}

function toggleSettings() {
  if (sheetList.classList.toggle('open')) {
    overlay.style.display = 'block';
    solve();
    endGame();
  } else {
    overlay.style.display = 'none';
  }
}

function toggleFabList() {
  fabList.classList.toggle('open');
}

function tileClicked(e) {
  if (e.target != gameArea && canMove(e.target)) {
    console.log(e.target);
    move(e.target);
    updateMoveCount();
    if(checkWin()) {
      divWon.style.display = 'flex';
      divWon.style.visibility = 'visible';
    }
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
    return playerWon;
  }
}

function endGame() {
  gameArea.classList.add('win');
  blank.style.visibility = 'visible';

  startButton.style.display = 'flex';
  shuffleButton.style.display = 'none';
  solveButton.style.display = 'none';
  clearInterval(dateIntervalId);
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
  timerLabel.innerText = display;
}

function updateMoveCount() {
  movesLabel.innerText = movesCount++;
}

function updateSize(e) {
  size = e.target.value;
  sizeLabel.innerText = size;
  settingsChanged = true;
}

function updateDificulty(e) {
  dificulty = e.target.value;
  dificultyLabel.innerText = dificulty;
  settingsChanged = true;
}