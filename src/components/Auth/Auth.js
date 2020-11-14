import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';

import {authorize} from '../../store/slices/auth'
import classes from './Auth.module.css';
import Spinner from '../UI/Spinner/Spinner'

const auth = () => {
    //DEBUG:
    if(useSelector(state => state.tracker.debug.recharging) === true) console.log("RERENDERING AUTH");

    const [email, setEmail] = useState('user1@test.com');
    const [password, setPassword] = useState('useRpas$');
    const [remember, setRemember] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    const dispatch = useDispatch();

    const authFormHandler = event => {
        event.preventDefault();

        dispatch(authorize({email, password, isLogin, remember: isLogin ? remember : false}));
    }

    return(
        <div className={classes.Auth}>
            
            <form onSubmit={authFormHandler}>
                <label htmlFor="email">Email</label>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>

                <label htmlFor="password">Password</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                
                {isLogin && <label htmlFor="checkbox">Remember me</label>}
                {isLogin && <input type='checkbox' onChange={e => setRemember(e.target.checked)} checked={remember}/>}

                <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)}>Switch to {isLogin ? 'Sign Up' : 'Log In'}</button>
            {loading && <Spinner/>}
            <p>{error && error}</p>

        </div>
    );
}

export default auth;