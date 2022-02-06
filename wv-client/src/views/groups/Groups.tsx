import GroupsDashboard from 'components/groups/dashboard/GroupsDashboard';
import GroupsList from 'components/groups/groupsList/GroupsList';
import SelectedGroup from 'components/groups/selectedGroup/SelectedGroup';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getGroups } from 'store/slices/groups';
import logger from 'utils/logger';

import style from './Groups.module.scss';

const Groups: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();
  ///////////
  // STATE //
  ///////////
  const selectedGroup = useAppSelector((state) => state.groups.selectedGroup);
  
  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    dispatch(getGroups());
  }, []);

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groups}>
      {selectedGroup == null
        ? (
          <div className={style.outsideGroup}>
            <GroupsDashboard />
            <GroupsList />
          </div>
        )
        : (
          <div className={style.insideGroup}>
            <SelectedGroup />
          </div>
        )}
    </div>
  );
};

export default Groups;
