import React from 'react';
import { useLocation } from 'react-router-dom';
import Routes from 'routes/Routes';
import logger from 'utils/logger';
import Navbar from 'components/navigation/navbar/Navbar';

import style from './Content.module.scss';

const Content: React.FC = () => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const location = useLocation();

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const showNavbar = (): boolean => {
    const excludedLocations = ['/'];
    return !excludedLocations.includes(location.pathname);
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.content}>

      { showNavbar() && <Navbar /> }

      <div className={style.routes}>
        <Routes />
      </div>
      
    </div>
  );
};

export default Content;
