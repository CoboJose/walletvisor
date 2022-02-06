import React, { useEffect } from 'react';
import logger from 'utils/logger';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, useMediaQuery, useTheme } from '@mui/material';

import style from './UserInvitations.module.scss';
import { ApiError, GroupInvitationResponse, SvgIcons } from 'types/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { deleteGroupInvitation, getUserInvitations, joinGroup } from 'store/slices/groupInvitations';
import SVG from 'components/ui/svg/SVG';
import apiErrors from 'api/apiErrors';
import { getGroups } from 'store/slices/groups';

type UserInvitationsProps = {
  onClose: () => void
}

const UserInvitations = ({ onClose }: UserInvitationsProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));
  const dispatch = useAppDispatch();

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Get the group invitations when opened
    dispatch(getUserInvitations());
  }, []);

  ///////////
  // STATE //
  ///////////
  const userInvitations: GroupInvitationResponse[] = useAppSelector((state) => state.groupInvitations.userInvitations);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  //////////////
  // HANDLERS //
  //////////////
  const acceptHandler = async (groupInvitationResponse: GroupInvitationResponse) => {
    try {
      await dispatch(joinGroup(groupInvitationResponse)).unwrap();
      await dispatch(getGroups());
    } catch (error) {
      const err = error as ApiError;
      console.log(apiErrors(err.code));
    }
  };

  const deleteHandler = async (groupInvitationId: number) => {
    try {
      await dispatch(deleteGroupInvitation(groupInvitationId)).unwrap();
      await dispatch(getUserInvitations()).unwrap();
    } catch (error) {
      const err = error as ApiError;
      console.log(apiErrors(err.code));
    }
  };

  /////////
  // JSX //
  /////////
  return (
    <Dialog open fullScreen={isPhone} onClose={onClose}>
      <DialogTitle>
        Invitations
      </DialogTitle>

      <DialogContent dividers>
        <div className={style.userInvitations}>
          {userInvitations.length > 0 
            ? (
              <List className={style.list}>
     
                {userInvitations.map((ui) => (
                  <div key={ui.id} className={style.listItemContainer} style={{ }}>

                    <ListItem className={style.listItem}>
                      <ListItemText
                        primary={ui.groupName}
                        secondary={ui.inviterUserEmail}
                      />

                      <ListItemSecondaryAction>
                        <IconButton onClick={() => deleteHandler(ui.id)}>
                          <SVG name={SvgIcons.Close} style={{ fill: style.error, width: '15px', height: '15px' }} />
                        </IconButton>
                        <IconButton onClick={() => acceptHandler(ui)}>
                          <SVG name={SvgIcons.Ok} style={{ fill: style.success, width: '28px', height: '28px' }} />
                        </IconButton>
                      </ListItemSecondaryAction>

                    </ListItem>

                  </div>
                ))}
              </List>
            )
            : (
              <div>
                <br />
                No invitations to show
              </div>
            )}

        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}> OK </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInvitations;
