import UserConfiguration from 'components/configuration/UserConfiguration';
import React from 'react';
import logger from 'utils/logger';

import style from './Configuration.module.scss';

const Configuration: React.FC = () => {
  logger.rendering();

  /////////
  // JSX //
  /////////
  return (
    <div className={style.userConfiguration}>
      <UserConfiguration />
    </div>
  );
};

export default Configuration;
