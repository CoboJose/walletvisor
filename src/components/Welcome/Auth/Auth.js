import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux'

import {authorize} from '../../../store/slices/auth'
import styles from './Auth.module.css'

const Auth = (props) => {
    
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
        <div className={props.className}>
            
            <h1 className={styles.msg}>{isLogin ? 'Welcome Back' : 'Join now!'}</h1>

            <form className={styles.form} onSubmit={submitFormHandler}>
                
                <div className={styles.formInput}>
                    <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address"/>
                    {errorMSG("email")}
                </div>

                <div className={styles.formInput}>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
                    {errorMSG("password")}
                </div>

                {isLogin &&
                <div className={styles.checkbox}>
                    <label>Remember Me</label>
                    <input type='checkbox' onChange={e => setRemember(e.target.checked)} checked={remember}/>
                </div>
                }

                <div className={styles.buttonAndSpinner}>
                    <button className='' type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
                    {loading && <span className={styles.spinner}></span>}
                </div>
                
                {error && <p className={styles.serverError}>{error}</p>}
            </form>
            
            <div className={styles.switch}>
                <h2>{isLogin ? 'Need an account?' : 'Already have an account?'}</h2>
                <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create Account' : 'Log In'}</button>
            </div>
        </div>
    );
}
export default Auth;