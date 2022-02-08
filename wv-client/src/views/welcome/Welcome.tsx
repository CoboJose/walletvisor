import React, { useState } from 'react';
import LoginForm from 'components/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import RegisterForm from 'components/auth/registerForm/RegisterForm';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';

import Link from '@mui/material/Link/Link';

import style from './Welcome.module.scss';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  return (
    <div className={style.welcome}>

      <div className={style.titleContainer}>
        <SVG name={SvgIcons.Logo} className={style.logo} />
        <h1 className={style.title}>WALLET<span className={style.visor}>VISOR</span></h1>
      </div>

      <div className={style.form}>

        { isRegisterForm ? <RegisterForm /> : <LoginForm /> }

        <div className={style.smallLinks}>
          <Link variant="body2" onClick={() => setIsRegisterForm(!isRegisterForm)}>
            { isRegisterForm ? 'Already have an account? Log In' : "Don't have an account? Sign Up" }
          </Link>
          
          {!isRegisterForm && (
            <Link variant="body2" onClick={() => window.alert('Please, contact with cobogue@gmail.com')}>
              Forgot password?
            </Link>
          )}
        </div>

      </div>
    
    </div>
  );
};

export default Welcome;
