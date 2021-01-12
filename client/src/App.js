import React from "react";
import Header from "./components/Header";
import { Router, Route, Switch } from 'react-router-dom';

import history from './history';
import MarketList from './components/MarketList';
import MarketNew from './components/MarketNew';
import MarketInfo from './components/MarketInfo';
import BettorIndex from './components/MarketBettor';


import "./App.css";

const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <Header />
        <div>
          <Switch>
            <Route path="/" exact component={MarketList} />
            <Route path="/markets/new" exact component={MarketNew} />
            <Route path="/markets/:address" exact component={MarketInfo} />
            <Route path="/markets/:address/bettors" exact component={BettorIndex} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
