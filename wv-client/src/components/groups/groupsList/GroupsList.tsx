/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import style from './GroupsList.module.scss';
import { Group } from 'types/types';

type GroupListProps = {
  setSelectedGroup: (arg0: Group|null) => void,
}
const GroupsList = ({ setSelectedGroup }: GroupListProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////

  ///////////
  // STATE //
  ///////////
  const groups: Group[] = useAppSelector((state) => state.groups.groups);

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

      {groups.length > 0 
        ? (
          <List className={style.list}>
           
            {groups.map((g) => (
              <div key={g.id} className={style.listItemContainer} style={{ }}>

                <ListItem
                  button
                  onClick={() => setSelectedGroup(g)}
                  className={style.listItem}
                >
                  <div className={style.filling} style={{ backgroundColor: g.color }} />
                  <ListItemText
                    primary={g.name}
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
