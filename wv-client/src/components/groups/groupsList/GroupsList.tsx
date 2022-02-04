/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import style from './GroupsList.module.scss';
import { UserGroup } from 'types/types';

type GroupListProps = {
  setSelectedUserGroup: (arg0: UserGroup|null) => void,
}
const GroupsList = ({ setSelectedUserGroup }: GroupListProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////

  ///////////
  // STATE //
  ///////////
  const userGroups: UserGroup[] = useAppSelector((state) => state.groups.userGroups);

  //////////////
  // HANDLERS //
  //////////////

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupsList}>

      {userGroups.length > 0 
        ? (
          <List className={style.list}>
           
            {userGroups.map((ug) => (
              <div key={ug.group.id} className={style.listItemContainer} style={{ }}>

                <ListItem
                  button
                  onClick={() => setSelectedUserGroup(ug)}
                  className={style.listItem}
                >
                  <div className={style.filling} style={{ backgroundColor: ug.group.color }} />
                  <ListItemText
                    primary={ug.group.name}
                  />

                </ListItem>

              </div>
            ))}
          </List>
        )
        : (
          <div>
            <br />
            <br />
            No groups to show
            <br />
            <br />
          </div>
        )}

    </div>
  );
};

export default GroupsList;
