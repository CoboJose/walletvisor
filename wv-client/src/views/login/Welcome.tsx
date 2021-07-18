import React from 'react';

import LoginForm from 'components/forms/auth/LoginForm';
import ServerStatus from 'components/others/ServerStatus';

import logger from 'utils/logger';
import logo from 'assets/icons/others/logo.svg';

import classes from './Login.module.scss';

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
    <div className={classes.login}>
      <img src={logo} alt="logo" className={classes.logo} />
      <h1 className={classes.title}>WalletVisor</h1>
      <span className={classes.subtitle}>Organizing your finances<br />Organizing your life</span>

      <LoginForm />
      <ServerStatus />
    </div>
  );
};

export default Welcome;
