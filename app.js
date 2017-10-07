window.onload = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const BOARD_WIDTH = 7;
  const BOARD_HEIGHT = 6;
  const PIECE_SIZE = 60;

  canvas.style.width = canvas.width = BOARD_WIDTH * PIECE_SIZE;
  canvas.style.height = canvas.height = BOARD_HEIGHT * PIECE_SIZE;

  const EMPTY = 0;
  const PLAYER_1 = 1;
  const PLAYER_2 = 2;

  const board = Array(BOARD_WIDTH * BOARD_HEIGHT).fill(EMPTY);
  let currentPlayer = PLAYER_1;

  function getColAndRowFromIndex(idx) {
    return {
      row: Math.floor(idx / BOARD_WIDTH),
      col: idx % BOARD_WIDTH
    };
}

  function getPieceAt(col, row) {
    return board[row * BOARD_WIDTH + col];
  }

  function setPieceAt(col, row, piece) {
    board[row * BOARD_WIDTH + col] = piece;
  }

  function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = PIECE_SIZE / 2;

    board.forEach((piece, idx) => {
      const { row, col } = getColAndRowFromIndex(idx);

      const cirX = col * PIECE_SIZE + radius;
      const cirY = row * PIECE_SIZE + radius;

      ctx.beginPath();
      ctx.arc(cirX, cirY, radius, 0, Math.PI * 2);

      if (piece === EMPTY) {
        ctx.strokeStyle = '#888';
        ctx.stroke();
      } else {
        ctx.fillStyle = piece === PLAYER_1
          ? '#333'
          : '#800';
        ctx.fill();
      }
    });
  }

  canvas.addEventListener('click', (event) => {
    if (currentPlayer === null) {
      return; // Game has ended
    }

    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;

    const clickCol = Math.floor(clickX / PIECE_SIZE);

    if (getPieceAt(clickCol, 0) !== EMPTY) {
      return;
    }

    let searchRow = BOARD_HEIGHT - 1;

    while (getPieceAt(clickCol, searchRow) !== EMPTY) {
      searchRow--;
      if (searchRow === 0) {
        break;
      }
    }

    setPieceAt(clickCol, searchRow, currentPlayer);
    paint();

    function searchConsec(col, row, dx, dy) {
      let consecPieces = 0;

      // Check for row
      for (let i = 0; i < 4; i++) {
        const sCol = col + i * dx;
        const sRow = row + i * dy;

        if (sCol > BOARD_WIDTH - 1 || sRow > BOARD_HEIGHT - 1) {
          continue;
        }

        if (getPieceAt(sCol, sRow) === currentPlayer) {
          consecPieces++;
        }
      }

      return consecPieces === 4;
    }

    const vecs = [{
      dx: 1, dy: 0 // W->E
    }, {
      dx: 0, dy: 1 // N->S
    }, {
      dx: 1, dy: 1 // NW->SE
    }, {
      dx: -1, dy: 1 // NE->SW
    }];

    const hasPlayerWon = board.find((piece, idx) => {
      const { row, col } = getColAndRowFromIndex(idx);

      return vecs.some((vec) => searchConsec(col, row, vec.dx, vec.dy));
    });

    if (hasPlayerWon) {
      setTimeout(() => {
        alert(`Player ${currentPlayer} won!`);
        currentPlayer = null;
      }, 0);
    } else {
      currentPlayer = currentPlayer === PLAYER_1
        ? PLAYER_2
        : PLAYER_1;
    }
  });

  paint();
};
