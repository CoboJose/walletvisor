import React, { useState } from 'react';
import logger from 'utils/logger';

import { Alert, Button, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { SvgIcons, UserGroup } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import GroupInvitationsModal from 'components/groups/selectedGroup/groupInvitations/GroupInvitationsModal';

type ButtonGroupInvitationsProps = {
  userGroup: UserGroup
}
const ButtonGroupInvitations = ({ userGroup }: ButtonGroupInvitationsProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('');

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  return (
    <div>
      {isPhone ? (
        <Button
          variant="outlined"
          onClick={() => setIsModalOpen(true)}
          size="small"
          startIcon={<SVG name={SvgIcons.User} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          Invitations
        </Button>
      ) : (
        <Button
          variant="text"
          onClick={() => setIsModalOpen(true)}
          size="medium"
          startIcon={<SVG name={SvgIcons.User} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          Invitations
        </Button>
      )}

      {isModalOpen && <GroupInvitationsModal userGroup={userGroup} setSnackbarText={setSnackbarText} onClose={onCloseModal} />}

      <Snackbar 
        open={snackbarText !== ''} 
        autoHideDuration={2500} 
        onClose={() => setSnackbarText('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setSnackbarText('')} severity="success">
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ButtonGroupInvitations;
