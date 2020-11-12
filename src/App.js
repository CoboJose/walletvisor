import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import logo from './assets/images/logo.png';
import './App.css';
import Tracker from './components/Tracker/Tracker';
import Auth from './components/Auth/Auth';

const App = () => {
  
  if(useSelector(state => state.tracker.debug.recharging) === true){
    console.log("RERENDERING APP");
  }
  
  const dispatch = useDispatch();
  const userToken = useSelector(s => s.auth.token);
  const userId = useSelector(s => s.auth.userId);

  useEffect(() => {
    //dispatch(actions.tryAutoLogIn());
  }, [])
  
  const view = userToken ? 'tracker' : 'auth';

  let render;
  switch(view){
    case 'auth':
      render = (<Auth/>);
      break;
    case 'tracker':
      render = (<Tracker/>);
      break;
  }

  return (
    <div className="App">
      <img src={logo} alt="logo"/><br/>
      {userToken && <p>Welcome, &apos;{userId}&apos;.</p>}
      {/*userToken && <div><button onClick={() => dispatch(actions.logout())}>Log out</button><br></br><br></br></div>*/}
      
      {render}
    </div>
  );
}

export default App;
