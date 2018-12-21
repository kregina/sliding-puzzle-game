import style from "./main.scss";



function swap(a, b) {
  [a.style.gridRow, b.style.gridRow] = [b.style.gridRow, a.style.gridRow];
  [a.style.gridColumn, b.style.gridColumn] = [b.style.gridColumn, a.style.gridColumn];
}

function createHtmlElement(size = 3){
 const fragment = document.createDocumentFragment();
  for(let row = 1; row <= size; row++){
    for(let col = 1; col <= size; col++){
      const element = document.createElement('li');

      element.textContent = fragment.children.length + 1;
      element.style.gridRow = row ;
      element.style.gridColumn = col;

      element.onclick  = tileClicked;

      fragment.appendChild(element);
    }
  }
  return fragment;
}