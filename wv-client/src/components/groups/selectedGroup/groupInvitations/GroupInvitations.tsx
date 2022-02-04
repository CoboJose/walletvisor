import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';

import TextField from '@mui/material/TextField/TextField';
import { Alert, Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';

import style from './GroupInvitations.module.scss';
import { ApiError, GroupInvitationResponse, SvgIcons, UserGroup } from 'types/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { createGroupInvitation, deleteGroupInvitation, getGroupInvitations } from 'store/slices/groupInvitations';
import SVG from 'components/ui/svg/SVG';
import apiErrors from 'api/apiErrors';
import regex from 'utils/regex';

type GroupFormProps = {
  userGroup: UserGroup,
  setSnackbarText: (arg0: string) => void
}

const GroupInvitations = ({ userGroup, setSnackbarText }: GroupFormProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Get the group invitations when opened
    dispatch(getGroupInvitations(userGroup.group.id));
  }, []);

  ///////////
  // STATE //
  ///////////
  const groupInvitations: GroupInvitationResponse[] = useAppSelector((state) => state.groupInvitations.groupInvitations);

  const [email, setEmail] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'Not a valid Email';
    }
    if (groupInvitations.some((gi) => gi.invitedUserEmail === email)) {
      errors.email = 'User already invited';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(createGroupInvitation({ email, groupId: userGroup.group.id })).unwrap();
        setServerError('');
        setSnackbarText('Invitation Sended');
      } catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  const deleteHandler = async (groupInvitationId: number) => {
    try {
      await dispatch(deleteGroupInvitation(groupInvitationId)).unwrap();
      await dispatch(getGroupInvitations(userGroup.group.id)).unwrap();
      setServerError('');
    } catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupInvitations}>

      <form onSubmit={submitHandler} className={style.invitationsForm}>

        { serverError.length > 0 && (
          <Alert severity="error">{serverError}</Alert>
        ) }
        
        <TextField
          type="email"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          autoFocus
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
        <p>Pending Invitations</p>
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
                      <IconButton onClick={() => deleteHandler(gi.id)}>
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
  );
};

export default GroupInvitations;
