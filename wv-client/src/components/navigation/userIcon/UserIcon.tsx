import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { logout } from 'store/slices/auth';
import logger from 'utils/logger';
import { GroupInvitationResponse, SvgIcons } from 'types/types';
import { useHistory } from 'react-router-dom';
import { Badge, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import SVG from 'components/ui/svg/SVG';
import style from './UserIcon.module.scss';
import { getUserInvitations } from 'store/slices/groupInvitations';
import UserInvitations from 'components/groups/userInvitations/UserInvitations';

type UserIconProps = {
  size: string
}

const UserIcon = ({ size }: UserIconProps): JSX.Element => {
  logger.rendering();

  const dispatch = useAppDispatch();
  const history = useHistory();

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Get the user invitations when opened
    dispatch(getUserInvitations());
  }, []);

  const userInvitations: GroupInvitationResponse[] = useAppSelector((state) => state.groupInvitations.userInvitations);
  const userName = useAppSelector((state) => state.user.user?.name);
  const theme = useAppSelector((state) => state.config.theme);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isInvitationsOpen, setIsInvitationsOpen] = useState<boolean>(false);

  return (
    <div>
      
      <Tooltip title={userName || 'User'}>
        
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
          <Badge color={theme === 'dark' ? 'primary' : 'secondary'} badgeContent={userInvitations.length}>
            <SVG name={SvgIcons.User} className={style.userSvg} style={{ height: size, width: size }} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >

        <div className={style.text}>
          Hello there, <span className={style.userName}>{userName}</span>
        </div>

        <Divider />

        <MenuItem onClick={() => [setIsInvitationsOpen(true), setAnchorEl(null)]}>
          <ListItemIcon>
            <Badge color={theme === 'dark' ? 'primary' : 'secondary'} badgeContent={userInvitations.length}>
              <SVG name={SvgIcons.Group} className={style.icon} />
            </Badge>
          </ListItemIcon>
          Invitations
        </MenuItem>

        <MenuItem onClick={() => [history.push('configuration'), setAnchorEl(null)]}>
          <ListItemIcon>
            <SVG name={SvgIcons.Settings} className={style.icon} />
          </ListItemIcon>
          Configuration
        </MenuItem>

        <MenuItem onClick={() => [dispatch(logout()), setAnchorEl(null)]}>
          <ListItemIcon>
            <SVG name={SvgIcons.Logout} className={style.icon} />
          </ListItemIcon>
          Logout
        </MenuItem>

      </Menu>

      {isInvitationsOpen && <UserInvitations onClose={() => setIsInvitationsOpen(false)} />}

    </div>
  );
};

export default UserIcon;
