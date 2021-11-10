import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logger from 'utils/logger';
import Routes from 'routes/Routes';

import TopBar from '../navigation/topBar/TopBar';
import SidePanel from '../navigation/sidePanel/SidePanel';

import style from './View.module.scss';

const View = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const location = useLocation();

  const [phoneSidePanelOpen, setPhoneSidePanelOpen] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const showNavigation = (): boolean => {
    const excludedLocations = ['/'];
    return !excludedLocations.includes(location.pathname);
  };

  const handlePhoneSidePanelOpen = (): void => {
    setPhoneSidePanelOpen(true);
  };
  const handlePhoneSidePanelClose = (): void => {
    setPhoneSidePanelOpen(false);
  };

  return (
    <div className={style.view}>

      { showNavigation() && (
        <>
          <TopBar handlePhoneSidePanelOpen={handlePhoneSidePanelOpen} />
          <SidePanel 
            phoneSidePanelOpen={phoneSidePanelOpen} 
            handlePhoneSidePanelOpen={handlePhoneSidePanelOpen} 
            handlePhoneSidePanelClose={handlePhoneSidePanelClose}
          />
        </>
      )}

      <div className={`${style.content} ${showNavigation() ? style.navigation : style.noNavigation}`}>
        <Routes />
      </div>

    </div>
  );
};

export default View;
