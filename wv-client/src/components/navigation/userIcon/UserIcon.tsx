/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useAppDispatch } from 'store/hooks';
import { logout } from 'store/slices/auth';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import { IconButton, Menu, MenuItem, MenuProps, withStyles } from '@material-ui/core';

import SVG from 'components/ui/svg/SVG';

import style from './UserIcon.module.scss';

const StyledMenu = withStyles({})((props: MenuProps) => (
  <Menu
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

type UserIconProps = {
  size: string
}

const UserIcon = ({ size }: UserIconProps): JSX.Element => {
  logger.rendering();

  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <div>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <SVG name={SvgIcons.User} className={style.userSvg} style={{ height: size, width: size }} />
      </IconButton>
      
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => [dispatch(logout()), setAnchorEl(null)]}>Logout</MenuItem>
      </StyledMenu>
    </div>
  );
};

export default UserIcon;
