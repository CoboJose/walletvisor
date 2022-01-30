import React from 'react';
import { Button, Card } from '@mui/material';
import logger from 'utils/logger';
import style from './SelectedGroup.module.scss';
import { Group } from 'types/types';

type SelectedGroupProps = {
  group: Group,
  setSelectedGroup: (arg0: Group|null) => void,
}
const SelectedGroup = ({ group, setSelectedGroup }: SelectedGroupProps): JSX.Element => {
  logger.rendering();

  return (
    <div className={style.selectedGroup}>
      <Card>
        <Button onClick={() => setSelectedGroup(null)}>
          Go Back
        </Button>
        { group.name }
      </Card>
    </div>
  );
};

export default SelectedGroup;
