import React from 'react';

import LoginForm from 'components/forms/auth/LoginForm';
import * as logger from 'utils/logger';
import logo from 'assets/icons/others/logo.svg';
import classes from './Login.module.scss';

const Login: React.FC = () => {
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
    <div className={classes.login}>
      <img src={logo} alt="logo" className={classes.logo} />
      <h1 className={classes.title}>WalletVisor</h1>
      <span className={classes.subtitle}>Organizing your finances<br />Organizing your life</span>

      <LoginForm />
    </div>
  );
};

export default Login;
