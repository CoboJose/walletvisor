import React, { useState } from 'react';
import LoginForm from 'components/forms/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import RegisterForm from 'components/forms/auth/registerForm/RegisterForm';
import SVG from 'components/ui/svg/SVG';
import { useAppDispatch } from 'store/hooks';
import { changeTheme } from 'store/slices/config';
import { SvgIcons } from 'types/types';
import Switch from '@material-ui/core/Switch';

import Link from '@material-ui/core/Link/Link';

import style from './Welcome.module.scss';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  return (
    <div className={style.welcome}>

      <SVG name={SvgIcons.Logo} className={style.logo} />

      <h1 className={style.title}>WALLET<span className={style.visor}>VISOR</span></h1>

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

      <button type="button" onClick={() => dispatch(changeTheme())}>Change theme</button>
      <Switch
        color="primary"
        checked
        onChange={() => dispatch(changeTheme())}
      />
      
    </div>
  );
};

export default Welcome;
