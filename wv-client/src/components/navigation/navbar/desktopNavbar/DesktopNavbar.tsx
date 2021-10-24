/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeTheme } from 'store/slices/config';
import { logout } from 'store/slices/auth';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import { NavbarProps } from '../Navbar';

import style from './DesktopNavbar.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: style.desktopNavbarWidth,
    },
  }),
);

const DesktopNavbar = ({ onClickHandler, principalRoutesList, selected } : NavbarProps): JSX.Element => {
  logger.rendering();
  
  const dispatch = useAppDispatch();
  const muiStyle = useStyles();

  const theme = useAppSelector((state) => state.config.theme);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={style.desktopNavbar}
      classes={{ paper: muiStyle.drawerPaper }}
    >
      {/* NAVBAR TOP */}
      <div className={style.desktopNavbarTop}>
        <SVG name={SvgIcons.Logo} className={style.logoIcon} />
        <div className={style.title}>WALLET<span className={style.visor}>VISOR</span></div>
      </div>

      <Divider />

      {/* NAVBAR ROUTES LINKS */}
      <List>
        {principalRoutesList.map((listItem) => (
          <ListItem
            key={listItem.path} 
            button 
            selected={listItem.path === selected} 
            onClick={() => onClickHandler(listItem.path)}
          >
            <ListItemIcon> <SVG name={listItem.svg} className={style.icon} /> </ListItemIcon>
            <ListItemText primary={listItem.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* NAVBAR BOTTOM */}
      <div className={style.desktopNavbarBottom}>

        <Divider />

        <div className={style.themeSwitcher}>
          <div className={style.label}>Theme</div>
          <div className={style.option}>Light</div>
          <Switch
            color="primary"
            checked={theme === 'dark'}
            onChange={() => dispatch(changeTheme())}
          />
          <div className={style.option}>Dark</div>
        </div>

        <Button onClick={() => dispatch(logout())} className={style.logoutButton}>Log out</Button>
        
      </div>

    </Drawer>
  );
};

export default DesktopNavbar;
