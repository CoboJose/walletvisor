import React from 'react';
import { Card } from '@mui/material';
import ButtonGroup from 'components/navigation/modalButtons/ButtonGroup';
import logger from 'utils/logger';
import style from './GroupsDashboard.module.scss';
import { useAppSelector } from 'store/hooks';
import { GroupDTO } from 'types/types';
import math from 'utils/math';

const GroupsDashboard = (): JSX.Element => {
  logger.rendering();

  const groupDtos: GroupDTO[] = useAppSelector((state) => state.groups.groupDtos);

  // eslint-disable-next-line no-return-assign
  const balance = groupDtos.reduce((sum, groupDto) => sum += groupDto.balance, 0);

  return (
    <Card className={style.groupsDashboard}>

      <div className={style.totalBalance}>
        {balance >= 0 ? 'You are owned ' : 'You own '} <span className={`${style.totalBalanceNumber} ${balance >= 0 ? style.positive : style.negative}`}>{math.formatEurNumber(balance)}</span>
      </div>

      <ButtonGroup />

    </Card>
  );
};

export default GroupsDashboard;
