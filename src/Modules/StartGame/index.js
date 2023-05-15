import "./index.scss";
import "./style.css";

import React, { useEffect, useState } from "react";

import moment from "moment/moment";
import { useLocation } from "react-router-dom";

// @constants
import { TILE_STATUS, BOARD_SIZE, LEVEL_MINE } from "./constants";

// @action logic game
import {
  markTile,
  revealTile,
  // checkWinOrLoose,
  getMinePosition,
  positionMatch,
} from "./minesweeper";

// antd
import { Button, Modal /* , Select */ } from "antd";

// hooks
import { useCountDown } from "../../utility/hooks/useCountDown";

function StartGame() {
  const location = useLocation();

  const { playName, level } = location.state || {};

  // console.log("location", location.state);

  const [point, setPoint] = useState();
  const [levelMine, setLevelMine] = useState(level);

  const [isBoard, setIsBoard] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [descriptionModal, setDescriptionModal] = useState("");

  const [itemClicked, setItemClicked] = useState([]);
  const [tableBoard, setTableBoard] = useState([]);

  // Nguyen Duc Tri
  const showModal = () => {
    handleStoreData();
    setIsStart(false);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isBoard) {
      displayBoard(level);
    }
  });

  // Count down
  const countDown = useCountDown({
    isStart,
    initValue: 1000 * 120 /* 10 */,
  });

  useEffect(() => {
    if (countDown !== 0) {
      setIsStart(true /* false */);
    } else {
      setTitleModal("Times up");
      setDescriptionModal("Please press continue to start a new game");
      showModal();
    }
  }, [countDown]);

  const getTimeString = (time = 0) => {
    return `${
      moment.duration(time).minutes() < 10
        ? "0" + moment.duration(time).minutes()
        : moment.duration(time).minutes()
    }:${
      moment.duration(time).seconds() < 10
        ? "0" + moment.duration(time).seconds()
        : moment.duration(time).seconds()
    }`;
  };
  // End

  // Pham Le Song Tuan
  // Display board
  const displayBoard = (numberMines) => {
    const board = createBoard(BOARD_SIZE, numberMines);
    // console.log("board", board);
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
          checkAddPoint(board);
          checkWinOrLoose(boardElement, board, messsageText);
          handleUndo(board);
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
    // console.log("minePositions", minePositions);

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

  let count = 0;

  const handleUndo = (boardArr) => {
    let data = [];
    const detail = {
      id: (count += 1),
      selectedData: data,
      start: 0,
      end: 0,
    };
    boardArr.forEach((item) => {
      item.forEach((ele) => {
        if (ele.status === TILE_STATUS.NUMBER) {
          data.push(ele);
        }
      });
    });
    setItemClicked((prev) => [...prev, detail]);
  };

  const handleUndoAction = () => {
    // console.log("undo");
    const curData = itemClicked[itemClicked?.length - 1];
    const prevData = itemClicked[itemClicked?.length - 2];

    // curData.selectedData.splice(0, prevData?.selectedData?.length);
    const listItemNotExist = curData?.selectedData?.filter(
      (item) =>
        !prevData?.selectedData?.some(
          (other) => item.x === other.x && item.y === other.y
        )
    );

    // console.log("test", listItemNotExist);
    // console.log("curData", curData);
    // console.log("prevData", prevData);

    listItemNotExist.forEach((item) => {
      if (!!item.element.textContent) {
        item.element.textContent = "";
      }
      item.status = TILE_STATUS.HIDDEN;
    });
    const filterData = itemClicked?.filter((item) => item?.id !== curData?.id);
    setItemClicked(filterData);
    checkAddPoint(tableBoard);
    /* ----- */
    // return curData?.selectedData?.map(
    //   (item) => (item.status = TILE_STATUS.HIDDEN)
    // );
  };
  // End

  // Diem Quyen Tran
  // Calculate point
  const checkAddPoint = (board) => {
    let listPoint = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const listItem = board[i];
      const point =
        listItem?.filter((item) => item?.status === TILE_STATUS.NUMBER)
          ?.length * 5;
      if (listItem?.length > 0) {
        listPoint?.push(point);
      }
    }

    const finalPoint = listPoint.reduce((total, currentValue) => {
      return total + currentValue;
    });

    setPoint(finalPoint);
  };

  // Store data in local storage
  const handleStoreData = (score) => {
    const getList = JSON.parse(localStorage.getItem("listUserPlay"));

    if (getList?.length > 0) {
      let listExist = [];
      for (let i = 0; i < getList?.length; i++) {
        listExist.push(getList[i]);
      }
      const userPlayedNext = {
        id: getList?.length + 1,
        user: playName,
        point: point ?? score,
        level: levelMine,
      };
      listExist.push(userPlayedNext);
      localStorage.setItem("listUserPlay", JSON.stringify(listExist));
    } else {
      const userPlay = {
        id: 1,
        user: playName,
        point: point ?? score,
        level: levelMine,
      };
      let listCreate = [];
      listCreate.push(userPlay);
      localStorage.setItem("listUserPlay", JSON.stringify(listCreate));
    }
  };

  // Handle take point
  const handleTakePoint = (board) => {
    setIsStart(false);
    setIsModalOpen(true);

    let listTest = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const listItem = board[i];
      const point =
        listItem?.filter((item) => item?.status === TILE_STATUS.NUMBER)
          ?.length * 5;
      if (listItem?.length > 0) {
        listTest?.push(point);
      }
    }

    const finalPoint = listTest.reduce((total, currentValue) => {
      return total + currentValue;
    });

    handleStoreData(finalPoint);
  };
  // End

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
      setTitleModal("You win");
      setDescriptionModal(
        "Please press continue to store your point and start a new game"
      );
      // showModal();
      // Fix bug tạm thời chỗ k có state point khi ấn vô quả bom
      handleTakePoint(board);
      // End
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
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        // onCancel={handleCancel}
        // maskClosable={false}
        closable={false}
        keyboard={false}
        footer={null}
        className="pop-up-container"
        centered
      >
        <div className="popup-announce">
          <h2>{titleModal}</h2>
          <h3>{descriptionModal}</h3>
          <div className="btn-redirect d-flex flex-row justify-content-center align-items-center gap-3">
            <Button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Back to homepage
            </Button>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
      <h3 className="title">Minesweeper</h3>
      <div className="d-flex flex-row justify-content-center align-items-center gap-3">
        <h4>
          Hello {playName} - Level{" "}
          {LEVEL_MINE?.find((item) => item.value === level)?.label}
        </h4>
      </div>
      <div className="subtext">
        Mines Left: <span data-mine-count></span>
      </div>
      <div className="information">
        <div className="d-flex flex-row justify-content-center align-items-center gap-4">
          {/* <Select
            defaultValue="Easy"
            style={{ width: 120 }}
            onChange={(e) => handleChangeLevel(e)}
            options={LEVEL_MINE}
          /> */}
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
      </div>
      <div className="board"></div>
    </React.Fragment>
  );
}

export default StartGame;
