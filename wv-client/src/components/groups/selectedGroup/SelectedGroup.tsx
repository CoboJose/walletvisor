import React, { useEffect } from 'react';
import { Button, Card } from '@mui/material';
import logger from 'utils/logger';
import style from './SelectedGroup.module.scss';
import ButtonAddGroupTransaction from 'components/navigation/modalButtons/ButtonAddGroupTransaction';
import GroupTransactionsList from './groupTransactionsList/GroupTransactionsList';
import { getGroupTransactions } from 'store/slices/groupTransactions';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import ButtonGroup from 'components/navigation/modalButtons/ButtonGroup';
import { setSelectedGroup } from 'store/slices/groups';

const SelectedGroup = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const userGroup = useAppSelector((state) => state.groups.selectedGroup)!;
  
  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    dispatch(getGroupTransactions({ groupId: userGroup.group.id }));
  }, []);

  return (
    <div className={style.selectedGroup}>
      <Card>
        <Button onClick={() => dispatch(setSelectedGroup(null))}>
          Go Back
        </Button>

        <ButtonAddGroupTransaction />
        <ButtonGroup />
      </Card>

      <GroupTransactionsList />
    </div>
  );
};

export default SelectedGroup;
