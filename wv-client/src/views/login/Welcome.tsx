import React from 'react';
import LoginForm from 'components/forms/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import { ReactComponent as Logo } from 'assets/icons/others/logo.svg';
import style from './Welcome.module.scss';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////

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

      <LoginForm />
    </div>
  );
};

export default Welcome;
