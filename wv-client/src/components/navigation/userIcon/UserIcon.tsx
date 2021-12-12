import React from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { logout } from 'store/slices/auth';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';
import { useHistory } from 'react-router-dom';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import SVG from 'components/ui/svg/SVG';
import style from './UserIcon.module.scss';

type UserIconProps = {
  size: string
}

const UserIcon = ({ size }: UserIconProps): JSX.Element => {
  logger.rendering();

  const dispatch = useAppDispatch();
  const history = useHistory();
  
  const userName = useAppSelector((state) => state.user.user?.name);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <div>
      <Tooltip title={userName || 'User'}>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
          <SVG name={SvgIcons.User} className={style.userSvg} style={{ height: size, width: size }} />
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
    </div>
  );
};

export default UserIcon;
