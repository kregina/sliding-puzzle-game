import style from './main.scss';

const size = 4;
const dificulty = 50;
const moves = [];

const tiles = createTiles(size);

const blank = tiles[tiles.length - 1];
blank.className = 'blank';

document.getElementById('solve').onclick = solve  ;
document.getElementById('shuffle').onclick = shuffle;

shuffle(dificulty);

const fragment = tiles
  .reduce((fragment, element) => {
    fragment.appendChild(element);
    return fragment;
  },
  document.createDocumentFragment());

document.getElementById('ulSliding').appendChild(fragment);

function tileClicked(e) {
  if (canMove(e.target)) {
    swap(e.target, blank);
    moves.push(e.target);
    checkWin();
  }
}

function checkWin() {
  const tileStatuses = tiles
    .map((el, i) => checkTileWin(size, i, el.style.gridRowStart, el.style.gridColumnStart))
    .map((win, i) => [win, tiles[i]])

  tileStatuses
    .forEach(([win, tile]) =>
      tile.classList.toggle('win', win));

  const playerWon = tileStatuses.every(([win]) => win);
  const divWon = document.getElementById('divWon');
  if (playerWon) {
    divWon.style.visibility = 'visible';
    divWon.style.opacity = 1;
  }
  setTimeout(() => {
    divWon.style.visibility = 'hidden';
    divWon.style.opacity = 0;
  }, 2000);
}

function checkTileWin(size, index, row, col) {
  return index == (row - 1) * size + (col - 1);
}

function shuffle() {
  for (let i = 0; i < dificulty; i++) {
    const availableMoves = tiles.filter(canMove);
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
  const deltaX = Math.abs(target.style.gridColumnStart - blank.style.gridColumnStart);
  const deltaY = Math.abs(target.style.gridRowStart - blank.style.gridRowStart);
  const delta = deltaX + deltaY;
  return delta === 1;
}

function swap(a, b) {
  [a.style.gridRow, b.style.gridRow] = [b.style.gridRow, a.style.gridRow];
  [a.style.gridColumn, b.style.gridColumn] = [b.style.gridColumn, a.style.gridColumn];
}

function createTiles() {
  const elements = [];
  const sizePx = 80 / size;
  for (let row = 1; row <= size; row++) {
    for (let col = 1; col <= size; col++) {
      const element = document.createElement('li');

      element.style.gridRow = row;
      element.style.gridColumn = col;
      element.style.backgroundImage = "url('src/images/monks.jpg')";
      element.style.backgroundPositionX = `-${(col -1) * sizePx}vmin`;
      element.style.backgroundPositionY = `-${(row -1) * sizePx}vmin`;

      element.onclick = tileClicked;

      elements.push(element);
    }
  }
  return elements;
}

