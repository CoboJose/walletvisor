import React, { useState } from 'react';
import logger from 'utils/logger';
import Routes from 'routes/Routes';

import TopBar from './topBar/TopBar';
import SidePanel from './sidePanel/SidePanel';

import style from './View.module.scss';

const View = (): JSX.Element => {
  logger.rendering();

  const [phoneSidePanelOpen, setPhoneSidePanelOpen] = useState<boolean>(false);

  const phoneSidePanelOpenHandler = (): void => {
    setPhoneSidePanelOpen(!phoneSidePanelOpen);
  };

  return (
    <div className={style.view}>

      <TopBar phoneSidePanelOpenHandler={phoneSidePanelOpenHandler} />

      <SidePanel phoneSidePanelOpen={phoneSidePanelOpen} phoneSidePanelOpenHandler={phoneSidePanelOpenHandler} />
      
      <div className={style.content}>
        <Routes />
      </div>

    </div>
  );
};

export default View;
