import "./index.scss";
import "./style.css";

import React, { useEffect, useState } from "react";

// constants
import { TILE_STATUS, BOARD_SIZE, LEVEL_MINE } from "./constants";

function StartGame() {
  const [tableBoard, setTableBoard] = useState([]);
  const [isBoard, setIsBoard] = useState(false);

  useEffect(() => {
    if (!isBoard) {
      displayBoard(1);
    }
  });

  // Display board
  const displayBoard = (numberMines) => {
    const board = createBoard(BOARD_SIZE, numberMines);
    setTableBoard(board);

    const boardElement = document.querySelector(".board");
    const mineLeftText = document.querySelector("[data-mine-count]");
    const messsageText = document.querySelector(".subtext");

    boardElement?.style.setProperty("--size", BOARD_SIZE);
    mineLeftText.textContent = numberMines;

    board.forEach((row) => {
      row.forEach((tile) => {
        boardElement?.append(tile.element);

        // Left click
        tile.element.addEventListener("click", () => {
          revealTile(board, tile);
          // checkAddPoint(board);
          checkWinOrLoose(boardElement, board, messsageText);
          // handleUndo(board);

          /*
          // Fix bug tạm thời chỗ k có state point khi ấn vô quả bom
          if (tile.mine) {
            setTitleModal("You loose");
            setDescriptionModal(
              "Because you click a bomb so press continue to start a new game"
            );
            // showModal();
            handleTakePoint(board);
          }
          // End
					*/
        });

        // Right click
        tile.element.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          markTile(tile);
          listMineLeft(boardElement, mineLeftText);
        });
      });
    });

    const listMineLeft = () => {
      const markedTilesLeft = board?.reduce((count, row) => {
        return (
          count +
          row.filter((tile) => tile.status === TILE_STATUS.MARKED).length
        );
      }, 0);

      mineLeftText.textContent = numberMines - markedTilesLeft;
    };
  };

  // Create board
  const createBoard = (squareSize, mineSize) => {
    const square = [];
    const minePositions = getMinePosition(squareSize, mineSize);

    for (let x = 0; x < squareSize; x++) {
      const row = [];
      for (let y = 0; y < squareSize; y++) {
        const element = document.createElement("div");
        element.dataset.status = TILE_STATUS.HIDDEN;
        const tile = {
          element,
          x,
          y,
          mine: minePositions.some(positionMatch.bind(null, { x, y })),
          get status() {
            return this.element.dataset.status;
          },
          set status(value) {
            this.element.dataset.status = value;
          },
        };

        row.push(tile);
      }

      square.push(row);
    }

    setIsBoard(true);

    return square;
  };

  const getMinePosition = (numberOfSquare, numberOfMine) => {
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

  const positionMatch = (a, b) => {
    return a.x === b.x && a.y === b.y;
  };

  const randomNumber = (size) => {
    return Math.floor(Math.random() * size);
  };

  // Mark square
  const markTile = (tileSquare) => {
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
  const revealTile = (eleBoard, tileSquare) => {
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
  const checkWinOrLoose = (boardElement, board, messsageText) => {
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

  return (
    <React.Fragment>
      <h3 className="title">Minesweeper</h3>
      <div className="subtext">
        Mines Left: <span data-mine-count></span>
      </div>
      {/* <div className="information">
        <div className="d-flex flex-row justify-content-center align-items-center gap-4">
          <Select
            defaultValue="Easy"
            style={{ width: 120 }}
            onChange={(e) => handleChangeLevel(e)}
            options={LEVEL_MINE}
          />
          <h3 className="point mb-0">Your point: {point}</h3>
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
          <h3 className="countdown">{getTimeString(countDown)}</h3>
          <Button
            onClick={() => handleUndoAction()}
            disabled={itemClicked?.length > 0 ? false : true}
          >
            Undo
          </Button>
        </div>
      </div> */}
      <div className="board"></div>
    </React.Fragment>
  );
}

export default StartGame;
