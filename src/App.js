import "./App.css";

import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// @page
import HomePage from "./Modules/Home";
import RankingPage from "./Modules/Ranking";
import StartGamePage from "./Modules/StartGame";
// import Setting from "./Modules/Setting";

{
  /* <Switch>
    <Route path="/" element={<Home />} />
    <Route path="/ranking" element={<Ranking />} />
    <Route path="/setting" element={<Setting />} />
    <Route path="/startgame" element={<StartGame />} />
  </Switch>
  </React.Fragment> */
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
        <Route path="/startgame" exact={true} component={StartGamePage} />
        <Route path="/ranking" exact={true} component={RankingPage} />
      </Switch>
    </Router>
  );
}

export default App;
