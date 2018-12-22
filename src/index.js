import style from './main.scss';

const size = 3;
const dificulty = 10;
const moves = [];

const fragment = createHtmlElement(size);
const tiles = Array.from(fragment.children);
const blank = tiles[tiles.length - 1];

blank.className = 'blank';
shuffle(dificulty);
document.getElementById('ulSliding').appendChild(fragment);
document.getElementById('solve').onclick = solve;
document.getElementById('shuffle').onclick = _ => shuffle(dificulty);

function tileClicked(e) {
  if (canMove(e.target)) {
    swap(e.target, blank);
    moves.push(e.target);
  }
}

function shuffle(dificulty) {
  for (let i = 0; i < dificulty; i++) {
    const availableMoves = tiles.filter(canMove);
    const randomTile = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    swap(randomTile, blank);
    moves.push(randomTile);
  }
}

function solve() {
  let tile;
  while ((tile = moves.pop())) {
    console.log('caiu aqui');
    swap(tile, blank);
  }
}

function canMove(click) {
  const deltaX = Math.abs(click.style.gridColumnStart - blank.style.gridColumnStart);
  const deltaY = Math.abs(click.style.gridRowStart - blank.style.gridRowStart);
  const delta = deltaX + deltaY;
  return delta === 1;
}

function swap(a, b) {
  [a.style.gridRow, b.style.gridRow] = [b.style.gridRow, a.style.gridRow];
  [a.style.gridColumn, b.style.gridColumn] = [b.style.gridColumn, a.style.gridColumn];
}

function createHtmlElement(size) {
  const fragment = document.createDocumentFragment();
  for (let row = 1; row <= size; row++) {
    for (let col = 1; col <= size; col++) {
      const element = document.createElement('li');

      element.textContent = fragment.children.length + 1;
      element.style.gridRow = row;
      element.style.gridColumn = col;

      element.onclick = tileClicked;

      fragment.appendChild(element);
    }
  }
  return fragment;
}

