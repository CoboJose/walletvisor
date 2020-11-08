import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';

import classes from './Auth.module.css';
import * as actions from '../../store/actions/actionsIndex';

const auth = () => {
    //DEBUG:
    if(useSelector(state => state.tracker.debug.recharging) === true) console.log("RERENDERING AUTH");

    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('password');
    const [isSignIn, setIsSignIn] = useState(true);
    const dispatch = useDispatch();

    const authFormHandler = event => {
        event.preventDefault();
        dispatch(actions.auth(email, password, isSignIn));
    }

    return(
        <div className={classes.Auth}>
            
            <form onSubmit={authFormHandler}>
                <label htmlFor="email">Email</label>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>

                <label htmlFor="password">Password</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>

                <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
            </form>
            
            <button onClick={() => setIsSignIn(!isSignIn)}>Switch to {isSignIn ? 'Sign Up' : 'Sign In'}</button>

        </div>
    );
}

export default auth;