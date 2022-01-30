import GroupsDashboard from 'components/groups/dashboard/GroupsDashboard';
import GroupsList from 'components/groups/groupsList/GroupsList';
import SelectedGroup from 'components/groups/selectedGroup/SelectedGroup';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getGroups } from 'store/slices/groups';
import { Group } from 'types/types';
import logger from 'utils/logger';

import style from './Groups.module.scss';

const Groups: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();
  ///////////
  // STATE //
  ///////////
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
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
            <GroupsList setSelectedGroup={setSelectedGroup} />
          </div>
        )
        : (
          <div className={style.insideGroup}>
            <SelectedGroup group={selectedGroup} setSelectedGroup={setSelectedGroup} />
          </div>
        )}
    </div>
  );
};

export default Groups;
