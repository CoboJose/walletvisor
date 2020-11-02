import React from 'react';

import logo from './assets/images/logo.png';
import './App.css';

import Tracker from './components/Tracker/Tracker'

const App = () => {
  
  console.log("RECHARGING APP")
  
  return (
    <div className="App">
      <img src={logo} alt="logo"/>
      
      <Tracker/>
    </div>
  );
}

export default App;
