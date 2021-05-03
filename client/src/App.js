import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import Tracker from './components/Tracker/Tracker';
import Welcome from './components/Welcome/Welcome';
import {logout, authWithRefreshTkn} from './store/slices/auth';
import {initTheme, changeTheme} from './store/slices/config';

const App = () => {
  
  if(useSelector(s => s.config.debug.renders)) console.log("RENDERING APP");
  
  const dispatch = useDispatch();
  const userToken = useSelector(s => s.auth.token);
  const userId = useSelector(s => s.auth.userId);
  
  useEffect(() => {
    
    dispatch(initTheme());

    const refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken !== null)
      dispatch(authWithRefreshTkn({refreshToken}))
      
  }, [])
  
  const view = userToken ? 'tracker' : 'auth';

  let render;
  switch(view){
    case 'auth':
      render = (<Welcome/>);
      break;
    case 'tracker':
      render = (<Tracker/>);
      break;
  }

  return (
    <div className="app">
      {userToken &&
        <div className='temporal'>
          <p>Welcome, &apos;{userId}&apos;</p>
          <button onClick={() => dispatch(logout())}>Log out</button>
          <button onClick={() => dispatch(changeTheme())}>Change Theme</button>
        </div>
      }
      
      {render}
    </div>
  );
}

export default App;
