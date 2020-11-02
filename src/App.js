import React from 'react';

import logo from './assets/images/logo.png';
import './App.css';

import Tracker from './components/Tracker/Tracker'

function App() {
  return (
    <div className="App">
      <img src={logo} alt="logo"/>
      
      <Tracker/>
    </div>
  );
}

export default App;
