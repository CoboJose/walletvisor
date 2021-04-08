import React from 'react';
import ReactDOM from 'react-dom';
import {Provider as ReduxProvider} from 'react-redux';
import store from './store/store'

import './index.css';
import App from './App';


const app = (
  <React.StrictMode>
    
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>

  </React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));





//import reportWebVitals from './reportWebVitals';
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//"react-router-dom": "^5.2.0"