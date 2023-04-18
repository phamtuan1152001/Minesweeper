import "./App.css";

import React from "react";

import { Route, Routes } from "react-router-dom";

// @page
import Home from "./Modules/Home";
import Ranking from "./Modules/Ranking";
import Setting from "./Modules/Setting";
import StartGame from "./Modules/StartGame";

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/startgame" element={<StartGame />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
