/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import style from './GroupsList.module.scss';
import { setSelectedGroup } from 'store/slices/groups';
import { GroupDTO } from 'types/types';
import math from 'utils/math';

const GroupsList = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const groupDtos: GroupDTO[] = useAppSelector((state) => state.groups.groupDtos);

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

      {groupDtos.length > 0 
        ? (
          <List className={style.list}>
           
            {groupDtos.map((groupDto) => (
              <div key={groupDto.group.id} className={style.listItemContainer} style={{ }}>

                <ListItem
                  button
                  onClick={() => dispatch(setSelectedGroup(groupDto))}
                  className={style.listItem}
                  secondaryAction={(
                    <div className={style.balance}>
                      {groupDto.balance > 0 && 'You are owned '} 
                      {groupDto.balance < 0 && 'You own '} 
                      <span className={`${style.balanceNumber} ${groupDto.balance >= 0 ? style.positive : style.negative}`}>
                        {math.formatEurNumber(groupDto.balance)}
                      </span>
                    </div>
                  )}
                >
                  <div className={style.filling} style={{ backgroundColor: groupDto.group.color }} />
                  <ListItemText
                    primary={groupDto.group.name}
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
