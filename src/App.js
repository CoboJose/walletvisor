import React from 'react';
import { useSelector } from 'react-redux';

import logo from './assets/images/logo.png';
import './App.css';

import Tracker from './components/Tracker/Tracker'

const App = () => {
  
  if(useSelector(state => state.tracker.debug.recharging) === true){
    console.log("RECHARGING APP");
}
  
  return (
    <div className="App">
      <img src={logo} alt="logo"/>
      
      <Tracker/>
    </div>
  );
}

export default App;
