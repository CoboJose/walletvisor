import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';

import {authorize} from '../../store/slices/auth'
import styles from './Auth.module.css';
import Spinner from '../UI/Spinner/Spinner'

const auth = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING AUTH");

    const [email, setEmail] = useState('user1@test.com');
    const [password, setPassword] = useState('useRpas$');
    const [remember, setRemember] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    const dispatch = useDispatch();
    
    const validateForm = () => {
        let valid = true;
        let errors = {};
        
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            valid = false;
            errors.email = "The email must follow this pattern: example@domain.com";
        }
        if(!password || password.length < 6){
            valid = false;
            errors.password = "The passsword must be at least 6 character long";
        }
        setFormErrors(errors);

        return valid;
    }
    const errorMSG = (field) => {
        if(formErrors[field]){
            return(<p className={styles.errormsg}>{formErrors[field]}</p>)
        }
    }
    
    const submitFormHandler = event => {
        event.preventDefault();
        if(validateForm()){
            dispatch(authorize({email, password, isLogin, remember: isLogin ? remember : false}));
        }
    }

    return(
        <div className={styles.Auth}>
            
            <form onSubmit={submitFormHandler}>
                <label htmlFor="email">Email</label>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>
                {errorMSG("email")}

                <label htmlFor="password">Password</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                {errorMSG("password")}

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