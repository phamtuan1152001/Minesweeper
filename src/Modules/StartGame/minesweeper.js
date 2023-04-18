import { TILE_STATUS } from "./constants";

export const getMinePosition = (numberOfSquare, numberOfMine) => {
  const positions = [];

  while (positions?.length < numberOfMine) {
    const position = {
      x: randomNumber(numberOfSquare),
      y: randomNumber(numberOfSquare),
    };

    // if (!positions.some(p => positionMatch(p, position))) {
    //   positions.push(position)
    // }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
};

export const positionMatch = (a, b) => {
  return a.x === b.x && a.y === b.y;
};

const randomNumber = (size) => {
  return Math.floor(Math.random() * size);
};

// Mark square
export const markTile = (tileSquare) => {
  if (
    tileSquare.status !== TILE_STATUS.HIDDEN &&
    tileSquare.status !== TILE_STATUS.MARKED
  ) {
    return;
  }

  if (tileSquare.status === TILE_STATUS.MARKED) {
    tileSquare.status = TILE_STATUS.HIDDEN;
  } else {
    tileSquare.status = TILE_STATUS.MARKED;
  }
};

// Reveal square
export const revealTile = (eleBoard, tileSquare) => {
  // console.log("tile", tileSquare);

  if (tileSquare.status !== TILE_STATUS.HIDDEN) {
    return;
  }

  if (tileSquare.mine) {
    tileSquare.status = TILE_STATUS.MINE;
    return;
  }

  tileSquare.status = TILE_STATUS.NUMBER;

  const adjacentSquare = nearbySquares(eleBoard, tileSquare);
  const mines = adjacentSquare?.filter((m) => m.mine);

  if (mines?.length === 0) {
    adjacentSquare.forEach(revealTile.bind(null, eleBoard));
  } else {
    tileSquare.element.textContent = mines.length;
  }
};

// Find square near
const nearbySquares = (eleBoard, { x, y }) => {
  const tile_square = [];

  for (let xOffset = -1; xOffset < 1; xOffset++) {
    for (let yOffset = -1; yOffset < 1; yOffset++) {
      const squareNear = eleBoard[x + xOffset]?.[y + yOffset];
      if (squareNear) {
        tile_square.push(squareNear);
      }
    }
  }
  // console.log("tile_square", tile_square);
  return tile_square;
};

// Handle check Win or Lose
export const checkWinOrLoose = (boardElement, board, messsageText) => {
  const win = checkWin(board);
  const loose = checkLoose(board);

  if (win || loose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messsageText.textContent = "You Win";
    /* setTitleModal("You win");
      setDescriptionModal(
        "Please press continue to store your point and start a new game"
      );
      // showModal();
      // Fix bug tạm thời chỗ k có state point khi ấn vô quả bom
      handleTakePoint(board);
      // End */
  }

  if (loose) {
    messsageText.textContent = "You Loose";
    board.forEach((row) => {
      row.forEach((squ) => {
        if (squ.status === TILE_STATUS.MARKED) {
          markTile(squ);
        }
        if (squ.mine) {
          revealTile(board, squ);
        }
      });
    });
  }
};

const stopProp = (e) => {
  e.stopImmediatePropagation();
};

const checkWin = (bo) => {
  return bo.every((row) => {
    return row.every((square) => {
      return (
        square.status === TILE_STATUS.NUMBER ||
        (square.mine &&
          (square.status === TILE_STATUS.HIDDEN ||
            square.status === TILE_STATUS.MARKED))
      );
    });
  });
};

const checkLoose = (bo) => {
  return bo.some((row) => {
    return row.some((square) => {
      return square.status === TILE_STATUS.MINE;
    });
  });
};
