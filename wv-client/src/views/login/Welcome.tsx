import React, { useState } from 'react';
import LoginForm from 'components/forms/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import { ReactComponent as Logo } from 'assets/icons/others/logo.svg';
import RegisterForm from 'components/forms/auth/registerForm/RegisterForm';
import style from './Welcome.module.scss';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  ////////////////
  // USE EFFECT //
  ////////////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////

  return (
    <div className={style.welcome}>

      <Logo className={style.logo} />
      
      <h1 className={style.title}>WalletVisor</h1>
      <span className={style.subtitle}>Organizing your finances<br />Organizing your life</span>

      { isRegisterForm ? <RegisterForm /> : <LoginForm /> }
      <div>
        { isRegisterForm ? 'Already have an account?' : "Don't have an account?" }
        <br /> 
        <button type="button" onClick={() => setIsRegisterForm(!isRegisterForm)}>{ isRegisterForm ? 'Login' : 'Register' }</button> now!
      </div>

    </div>
  );
};

export default Welcome;
