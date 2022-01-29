import React from 'react';
import { Card } from '@mui/material';
import ButtonCreateGroup from 'components/navigation/modalButtons/ButtonCreateGroup';
import logger from 'utils/logger';
import style from './GroupsDashboard.module.scss';

const GroupsDashboard = (): JSX.Element => {
  logger.rendering();

  return (
    <Card className={style.groupsDashboard}>
      <ButtonCreateGroup />
    </Card>
  );
};

export default GroupsDashboard;
