import React, { useState } from 'react';
import LoginForm from 'components/forms/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import { ReactComponent as Logo } from 'assets/icons/others/logo.svg';
import RegisterForm from 'components/forms/auth/registerForm/RegisterForm';

import Link from '@material-ui/core/Link/Link';

import style from './Welcome.module.scss';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  return (
    <div className={style.welcome}>

      <Logo className={style.logo} />

      <h1 className={style.title}>WALLET<span className={style.visor}>VISOR</span></h1>

      <div className={style.form}>

        { isRegisterForm ? <RegisterForm /> : <LoginForm /> }

        <div className={style.smallLinks}>
          <Link variant="body2" onClick={() => setIsRegisterForm(!isRegisterForm)}>
            { isRegisterForm ? 'Already have an account? Log In' : "Don't have an account? Sign Up" }
          </Link>
          
          {!isRegisterForm && (
            <Link variant="body2" onClick={() => console.log('UPS')}>
              Forgot password?
            </Link>
          )}
        </div>

      </div>
      
    </div>
  );
};

export default Welcome;
