import React, { useState, useEffect } from 'react';

import logger from 'utils/logger';
import api from 'api/api';

import style from './ServerStatus.module.scss';

const ServerStatus = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // STATE //
  ///////////

  const [isServerOn, setIsServerOn] = useState<boolean>(false);

  ////////////////
  // USE EFFECT //
  ////////////////
  
  useEffect(() => {
    setIsServerOn(false);

    try {
      api.ping();
      setIsServerOn(true);
    }
    catch (error) {
      logger.error(error);
    }
  }, []);

  /////////
  // JSX //
  /////////
  
  return (
    <div>
      <span>Server Status <span className={`${style.dot} ${isServerOn ? style.on : style.off}`} /> </span>
    </div>
  );
};

export default ServerStatus;
