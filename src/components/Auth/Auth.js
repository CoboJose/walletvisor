import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';

import * as actions from '../../store/actions/actionsIndex';
import classes from './Auth.module.css';
import Spinner from '../UI/Spinner/Spinner'

const auth = () => {
    //DEBUG:
    if(useSelector(state => state.tracker.debug.recharging) === true) console.log("RERENDERING AUTH");

    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('password');
    const [remember, setRemember] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    const dispatch = useDispatch();

    const authFormHandler = event => {
        event.preventDefault();
        dispatch(actions.auth(email, password, remember, isSignIn));
    }

    return(
        <div className={classes.Auth}>
            
            <form onSubmit={authFormHandler}>
                <label htmlFor="email">Email</label>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>

                <label htmlFor="password">Password</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                
                {isSignIn && <label htmlFor="checkbox">Remember me</label>}
                {isSignIn && <input type='checkbox' onChange={e => setRemember(e.target.checked)}/>}

                <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
            </form>

            <button onClick={() => setIsSignIn(!isSignIn)}>Switch to {isSignIn ? 'Sign Up' : 'Sign In'}</button>
            {loading && <Spinner/>}
            <p>{error && error.message}</p>

        </div>
    );
}

export default auth;