import GroupsDashboard from 'components/groups/dashboard/GroupsDashboard';
import React from 'react';
import logger from 'utils/logger';

import style from './Groups.module.scss';

const Groups: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  
  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groups}>
      <GroupsDashboard />
    </div>
  );
};

export default Groups;
