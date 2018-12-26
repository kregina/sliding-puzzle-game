import style from './main.css';

const root = document.querySelector(':root');
const ulSliding = document.getElementById('ulSliding');
const startButton = document.getElementById('start');
const solveButton = document.getElementById('solve');
const shuffleButton = document.getElementById('shuffle');
const fabButton = document.getElementById('fabButton');
const fabList = document.getElementById('fabList');

const moves = [];
const dificulty = 5;
const size = 4;

const tiles = createTiles(size);
const blank = tiles[tiles.length - 1];
blank.className = 'blank';
root.style.setProperty('--matrix-order', size);

startButton.onclick = startGame;
solveButton.onclick = solve;
shuffleButton.onclick = shuffle;
fabButton.onclick = toggleFabList;

startGame();

const fragment = tiles.reduce((fragment, element) => {
  fragment.appendChild(element);
  return fragment;
}, document.createDocumentFragment());

ulSliding.appendChild(fragment);

function startGame() {
  ulSliding.classList.remove('win');

  blank.style.visibility = 'hidden';
  divWon.style.display = 'none';

  startButton.style.display = 'none';
  shuffleButton.style.display = 'flex';
  solveButton.style.display = 'flex';

  shuffle(dificulty);
}

function toggleFabList() {
  fabList.classList.toggle('open');
}

function tileClicked(e) {
  if (canMove(e.target)) {
    swap(e.target, blank);
    moves.push(e.target);
    checkWin();
  }
}

function checkWin() {
  const tileStatuses = tiles
    .map(checkTileWin)
    .map((win, i) => [win, tiles[i]]);

  tileStatuses.forEach(([win, tile]) => tile.classList.toggle('win', win));

  const playerWon = tileStatuses.every(([win]) => win);
  const divWon = document.getElementById('divWon');
  if (playerWon) {
    ulSliding.classList.add('win');

    blank.style.visibility = 'visible';

    divWon.style.display = 'flex';
    divWon.style.visibility = 'visible';

    startButton.style.display = 'flex';
    shuffleButton.style.display = 'none';
    solveButton.style.display = 'none';
  }

}

// function checkTileWin(el, index) {
//   const row = el.style.getPropertyValue('--row');
//   const col = el.style.getPropertyValue('--col');
//   return index == row * size + col;
// }

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
    moves.push(randomTile);
    swap(randomTile, blank);
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

function canMove(target) {
  const deltaX = Math.abs(target.style.getPropertyValue('--col') - blank.style.getPropertyValue('--col'));
  const deltaY = Math.abs(target.style.getPropertyValue('--row') - blank.style.getPropertyValue('--row'));
  const delta = deltaX + deltaY;
  return delta === 1;
}

function notEqualToLastMove(tile) {
  return tile !== moves[moves.length - 1]
}

function swap(...tiles) {
  tiles
    .map((el, i) => [
      (tiles.length - 1) - i,
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
