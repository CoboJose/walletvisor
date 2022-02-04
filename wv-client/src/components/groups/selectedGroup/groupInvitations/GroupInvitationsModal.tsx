import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import logger from 'utils/logger';
import { UserGroup } from 'types/types';
import GroupInvitations from './GroupInvitations';

type GroupInvitationsModalProps = {
  userGroup: UserGroup,
  setSnackbarText: (arg0: string) => void
  onClose: () => void
}
const GroupInvitationsModal = ({ userGroup, setSnackbarText, onClose }: GroupInvitationsModalProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));
  
  ///////////
  // STATE //
  ///////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  //////////////
  // HANDLERS //
  //////////////

  return (
    <Dialog open fullScreen={isPhone} onClose={onClose}>
      <DialogTitle>
        Invitations
      </DialogTitle>

      <DialogContent dividers>
        <GroupInvitations userGroup={userGroup} setSnackbarText={setSnackbarText} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}> OK </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupInvitationsModal;
