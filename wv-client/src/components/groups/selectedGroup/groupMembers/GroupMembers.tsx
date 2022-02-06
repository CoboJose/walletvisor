import React, { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Snackbar, TextField, useMediaQuery, useTheme } from '@mui/material';
import logger from 'utils/logger';
import style from './GroupMembers.module.scss';
import { ApiError, GroupInvitationResponse, SvgIcons, User } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { removeGroup } from 'store/slices/groups';
import regex from 'utils/regex';
import apiErrors from 'api/apiErrors';
import { createGroupInvitation, deleteGroupInvitation, getGroupInvitations } from 'store/slices/groupInvitations';
import Confirmation from 'components/ui/confirmation/Confirmation';

const GroupMembers = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////
  const loggedUser = useAppSelector((state) => state.user.user!);
  const groupDto = useAppSelector((state) => state.groups.selectedGroupDto)!;
  const groupInvitations: GroupInvitationResponse[] = useAppSelector((state) => state.groupInvitations.groupInvitations);

  const [email, setEmail] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<User|null>(null);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateInvitationForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'Not a valid Email';
    }
    if (groupInvitations.some((gi) => gi.invitedUserEmail === email)) {
      errors.email = 'User already invited';
    }

    if (groupDto.users.some((u) => u.email === email)) {
      errors.email = 'User already in the group';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const removeUser = async () => {
    try {
      setServerError('');
      await dispatch(removeGroup({ groupId: groupDto.group.id, userId: userToDelete!.id })).unwrap();
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

  const getDeleteUserText = () => {
    if (userToDelete?.id === loggedUser.id) {
      return 'Are you sure you want to leave the group? Your active group transactions will be deleted';
    } 
    return 'Are you sure you want to remove the User from the group? The active transactions will be affected';
  };

  //////////////
  // HANDLERS //
  //////////////

  const submitInvitationHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInvitationForm()) {
      try {
        await dispatch(createGroupInvitation({ email, groupId: groupDto.group.id })).unwrap();
        setServerError('');
        setSnackbarText('Invitation Sended');
        setEmail('');
      } catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  const deleteInvitationHandler = async (groupInvitationId: number) => {
    try {
      await dispatch(deleteGroupInvitation(groupInvitationId)).unwrap();
      await dispatch(getGroupInvitations(groupDto.group.id)).unwrap();
      setServerError('');
    } catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
    setEmail('');
    setServerError('');
  };

  const confirmDeleteUserHandler = () => {
    removeUser();
    setUserToDelete(null);
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupMembers}>
      <div className={style.button}>
        {isPhone ? (
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
            size="small"
            startIcon={<SVG name={SvgIcons.Group} className={style.icon} />}
          >
            Members
          </Button>
        ) : (
          <Button
            variant="text"
            onClick={() => setIsModalOpen(true)}
            size="medium"
            startIcon={<SVG name={SvgIcons.Group} className={style.icon} />}
          >
            Members
          </Button>
        )}
      </div>

      <Dialog open={isModalOpen} fullScreen={isPhone} onClose={closeModalHandler}>
        <DialogTitle>
          Members
        </DialogTitle>

        <DialogContent dividers>
          <div className={style.dialogContent}>

            <div className={style.members}>
              {groupDto.users.length > 0 
              && (
              <List className={style.membersList}>
                {groupDto.users.map((u) => (
                  <ListItem key={u.id} className={style.listItem}>
                    <ListItemText
                      primary={u.name}
                      secondary={u.email}
                      className={u.id === loggedUser.id ? style.loggedUser : style.otherUser}
                    />
                    <ListItemSecondaryAction>
                      {u.id === loggedUser.id ? (
                        <Button 
                          onClick={() => setUserToDelete(u)}
                          startIcon={<SVG name={SvgIcons.Close} className={style.icon} />}
                          className={style.leaveButton}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setUserToDelete(u)}
                          startIcon={<SVG name={SvgIcons.Delete} className={style.icon} />}
                          className={style.removeButton}
                        >
                          Remove
                        </Button>
                      )}
                      
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              )}
            </div>
            <div className={style.invitations}>

              <p className={style.invitationsTitle}>Invitations</p>

              { serverError.length > 0 && (
                <Alert severity="error">{serverError}</Alert>
              )}

              <form onSubmit={submitInvitationHandler} className={style.invitationsForm}>
                <TextField
                  type="email"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email != null}
                  helperText={formErrors.email}
                />

                <Button type="submit">
                  Send
                </Button>

              </form>

              <div className={style.invitationsList}>
                <p className={style.listHeader}>Pending Invitations</p>
                {groupInvitations.length > 0 
                  && (
                    <List className={style.list}>
                      {groupInvitations.map((gi) => (
                        <div key={gi.id} className={style.listItemContainer} style={{ }}>
                          <ListItem className={style.listItem}>
                            <ListItemText
                              primary={gi.invitedUserEmail}
                            />
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => deleteInvitationHandler(gi.id)}>
                                <SVG name={SvgIcons.Delete} style={{ fill: style.error, width: '20px', height: '20px' }} />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </div>
                      ))}
                    </List>
                  )}
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModalHandler}> OK </Button>
        </DialogActions>
      </Dialog>

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

      <Confirmation
        text={getDeleteUserText()}
        buttonCancel="Cancel" 
        buttonOk={userToDelete?.id === loggedUser.id ? 'Leave' : 'Remove'} 
        open={userToDelete !== null} 
        onCancel={() => setUserToDelete(null)} 
        onOk={confirmDeleteUserHandler}
      />

    </div>
  );
};

export default GroupMembers;
