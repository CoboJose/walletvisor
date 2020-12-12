import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import Tracker from './components/Tracker/Tracker';
import Welcome from './components/Welcome/Welcome';
import {logout, authWithRefreshTkn} from './store/slices/auth';

const App = () => {
  
  if(useSelector(s => s.config.debug.renders)) console.log("RENDERING APP");
  
  const dispatch = useDispatch();
  const userToken = useSelector(s => s.auth.token);
  const userId = useSelector(s => s.auth.userId);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken !== null)
      dispatch(authWithRefreshTkn({refreshToken}));
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
    <div className="App">
      {userToken && <p>Welcome, &apos;{userId}&apos;.</p>}
      {userToken && <div><button onClick={() => dispatch(logout())}>Log out</button><br></br><br></br></div>}
      
      {render}
    </div>
  );
}

export default App;
