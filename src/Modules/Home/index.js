import "./index.scss";

import React, { useState } from "react";

import { Button, Modal, Input, Select } from "antd";

// @constants
import { LEVEL_MINE } from "../StartGame/constants";

import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [playName, setPlayerName] = useState("");
  const [level, setLevel] = useState(LEVEL_MINE[0].value);

  const goToPlayGame = () => {
    // window.location.href = "/startgame";
    // console.log("data", { playName, level });
    history.push({
      pathname: "/startgame",
      state: {
        playName,
        level,
      },
    });
  };

  const goToRankingBoard = () => {
    // window.location.href = "/ranking";
    history.push("/ranking");
  };

  const handleChangeLevel = (level) => {
    setLevel(level);
  };

  return (
    <div className="homepage-wrapper">
      <Modal
        className="popup-playgame"
        title=""
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        // onOk={handleOk}
        // keyboard={false}
        // maskClosable={false}
        closable={false}
        footer={null}
        centered
        width={600}
      >
        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
          <Input
            placeholder="Enter your full name"
            className="input-text"
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <Select
            defaultValue="Easy"
            style={{ width: 120 }}
            onChange={(e) => handleChangeLevel(e)}
            options={LEVEL_MINE}
          />
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center mt-3">
          <Button onClick={() => goToPlayGame()}>Start Game</Button>
        </div>
      </Modal>
      <h1>Home Page</h1>
      <div className="homepage-wrapper__content">
        <Button
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Play Game
        </Button>
        <Button onClick={() => goToRankingBoard()}>Ranking Board</Button>
      </div>
    </div>
  );
};

export default Home;
