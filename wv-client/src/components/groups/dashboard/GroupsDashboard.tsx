import React from 'react';
import { Card } from '@mui/material';
import ButtonGroup from 'components/navigation/modalButtons/ButtonGroup';
import logger from 'utils/logger';
import style from './GroupsDashboard.module.scss';

const GroupsDashboard = (): JSX.Element => {
  logger.rendering();

  return (
    <Card className={style.groupsDashboard}>
      <ButtonGroup />
    </Card>
  );
};

export default GroupsDashboard;
