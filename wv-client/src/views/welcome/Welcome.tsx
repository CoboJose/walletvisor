import React, { useState } from 'react';
import LoginForm from 'components/auth/loginForm/LoginForm';
import logger from 'utils/logger';
import RegisterForm from 'components/auth/registerForm/RegisterForm';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';

import Link from '@mui/material/Link/Link';

import style from './Welcome.module.scss';
import { Card } from '@mui/material';

const Welcome: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  /////////
  // JSX //
  /////////
  return (
    <div className={style.welcome}>

      <div className={style.info}>
        <div className={style.titleContainer}>
          <SVG name={SvgIcons.Logo} className={style.logo} />
          <h1 className={style.title}>WALLET<span className={style.visor}>VISOR</span></h1>
        </div>

        <div className={style.appInfo}>
          <div className={style.intro}><span className={style.appName}>WalletVisor</span> is an app to manage your personal finances</div>
          <div className={style.features}>
            <div className={style.feature}>
              <SVG name={SvgIcons.Exchange} className={style.icon} />
              Add and visualize your transactions with useful filters
            </div>
            <div className={style.feature}>
              <SVG name={SvgIcons.Chart} className={style.icon} />
              Get insightful statistics
            </div>
            <div className={style.feature}>
              <SVG name={SvgIcons.Group} className={style.icon} />
              Share expenses with a group
            </div>
            <div className={style.feature}>
              <SVG name={SvgIcons.Global} className={style.icon} />
              Access it anywhere with any device
            </div>
          </div>
        </div>
      </div>
     
      <Card variant="outlined" className={style.formCard}>
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
      </Card>
    
    </div>
  );
};

export default Welcome;
