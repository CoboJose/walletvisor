import GroupsDashboard from 'components/groups/dashboard/GroupsDashboard';
import GroupsList from 'components/groups/groupsList/GroupsList';
import SelectedGroup from 'components/groups/selectedGroup/SelectedGroup';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getGroups } from 'store/slices/groups';
import { UserGroup } from 'types/types';
import logger from 'utils/logger';

import style from './Groups.module.scss';

const Groups: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();
  ///////////
  // STATE //
  ///////////
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | null>(null);
  
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
      {selectedUserGroup == null
        ? (
          <div className={style.outsideGroup}>
            <GroupsDashboard />
            <GroupsList setSelectedUserGroup={setSelectedUserGroup} />
          </div>
        )
        : (
          <div className={style.insideGroup}>
            <SelectedGroup userGroup={selectedUserGroup} setSelectedUserGroup={setSelectedUserGroup} />
          </div>
        )}
    </div>
  );
};

export default Groups;
