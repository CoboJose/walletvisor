import React from 'react';
import { Button, Card } from '@mui/material';
import logger from 'utils/logger';
import style from './SelectedGroup.module.scss';
import { User, UserGroup } from 'types/types';
import ButtonGroupInvitations from 'components/navigation/modalButtons/ButtonGroupInvitations';
import ButtonAddGroupTransaction from 'components/navigation/modalButtons/ButtonAddGroupTransaction';

type SelectedGroupProps = {
  userGroup: UserGroup,
  setSelectedUserGroup: (arg0: UserGroup|null) => void,
}
const SelectedGroup = ({ userGroup, setSelectedUserGroup }: SelectedGroupProps): JSX.Element => {
  logger.rendering();

  return (
    <div className={style.selectedGroup}>
      <Card>
        <Button onClick={() => setSelectedUserGroup(null)}>
          Go Back
        </Button>
        <ButtonAddGroupTransaction userGroup={userGroup} />
        <ButtonGroupInvitations userGroup={userGroup} />
        {'Name: ' + userGroup.group.name }
        {userGroup.users.map((u: User) => (
          <p>{ u.email }</p>
        ))}
      </Card>
    </div>
  );
};

export default SelectedGroup;
