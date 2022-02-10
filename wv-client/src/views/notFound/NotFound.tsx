import React from 'react';
import logger from 'utils/logger';

import style from './NotFound.module.scss';

const NotFound: React.FC = () => {
  logger.rendering();

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactions}>
      <p>Not Found</p>
    </div>
  );
};

export default NotFound;
