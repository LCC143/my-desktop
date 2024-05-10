const container = document.getElementById('container');
const minesCountInput = document.getElementById('minesCount');
let size = 10; // Tamaño del tablero (10x10 en este caso)
let minesCount = parseInt(minesCountInput.value); // Cantidad de minas

let board = [];

function initializeBoard() {
  board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push({
        isMine: false,
        isOpen: false,
        isFlagged: false,
        neighbors: 0
      });
    }
    board.push(row);
  }
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }
}

function renderBoard() {
  container.innerHTML = '';
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell', 'hidden');
      cellDiv.dataset.row = i;
      cellDiv.dataset.col = j;
      cellDiv.addEventListener('click', () => {
        revealCell(i, j);
      });
      cellDiv.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(i, j);
      });
      container.appendChild(cellDiv);
    });
    container.appendChild(document.createElement('br'));
  });
}

function restartGame() {
  size = 10; // Puedes cambiar el tamaño aquí si deseas reiniciar con otro tamaño predeterminado
  minesCount = parseInt(minesCountInput.value);
  initializeBoard();
  placeMines();
  renderBoard();
}

function revealCell(x, y) {
  if (board[x][y].isMine) {
    alert('¡Has perdido!');
    revealMines();
    return;
  }

  const cell = document.querySelector(`[data-row='${x}'][data-col='${y}']`);
  if (!cell || board[x][y].isOpen) return;

  board[x][y].isOpen = true;
  cell.classList.remove('hidden');
  cell.textContent = countAdjacentMines(x, y);

  if (cell.textContent === '0') {
    for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, size - 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, size - 1); j++) {
        revealCell(i, j);
      }
    }
  }
}

function countAdjacentMines(x, y) {
  let count = 0;
  for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, size - 1); i++) {
    for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, size - 1); j++) {
      if (board[i][j].isMine) count++;
    }
  }
  return count;
}

function toggleFlag(x, y) {
  const cell = document.querySelector(`[data-row='${x}'][data-col='${y}']`);
  if (!cell || board[x][y].isOpen) return;

  board[x][y].isFlagged = !board[x][y].isFlagged;
  cell.classList.toggle('flagged');
}

function revealMines() {
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.isMine) {
        const mineCell = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
        mineCell.classList.remove('hidden');
        mineCell.textContent = '💣';
      }
    });
  });
}

initializeBoard();
placeMines();
renderBoard();
