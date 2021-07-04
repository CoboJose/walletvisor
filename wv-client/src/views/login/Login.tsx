import React from 'react';

import AuthForm from 'components/forms/auth/AuthForm';
import * as logger from 'utils/logger';
import * as api from 'api/api';
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
  
  const authFormHandler = (email: string, password: string) => {
    console.log('AuthFormHandler: ' + email + ' ' + password);

    api.login(email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /////////
  // JSX //
  /////////

  return (
    <div className={classes.login}>
      <img src={logo} alt="logo" className={classes.logo} />
      <h1 className={classes.title}>WalletVisor</h1>
      <span className={classes.subtitle}>Organizing your finances<br />Organizing your life</span>

      <AuthForm formHandler={authFormHandler} />
    </div>
  );
};

export default Login;
