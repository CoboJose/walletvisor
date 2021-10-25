import React from 'react';
import SVG from 'components/ui/svg/SVG';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { logout } from 'store/slices/auth';
import { changeTheme } from 'store/slices/config';
import { SvgIcons } from 'types/types';
import { SidePanelListItems } from 'components/view/sidePanel/SidePanel';
import logger from 'utils/logger';

import { Divider, List, ListItem, ListItemIcon, ListItemText, Button, Switch, SwipeableDrawer } from '@material-ui/core';

import style from './PhoneSidePanel.module.scss';

type PhoneSidePanelProps = {
  principalRoutesList: SidePanelListItems[],
  open: boolean,
  openHandler: (arg0: boolean) => void,
}

const PhoneSidePanel = ({ principalRoutesList, open, openHandler }: PhoneSidePanelProps): JSX.Element => {
  logger.rendering();
  
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const theme = useAppSelector((state) => state.config.theme);

  const iOS = new RegExp(/iPad|iPhone|iPod/).test(navigator.userAgent);

  return (
    <SwipeableDrawer
      variant="temporary"
      anchor="left"
      className={style.phoneSidePanel}
      classes={{ paper: style.phoneSidePanelPaper }}
      ModalProps={{ keepMounted: true }}
      open={open}
      onClose={() => openHandler(false)}
      onOpen={() => openHandler(true)}
      disableBackdropTransition
      disableDiscovery
    >
      {/* SIDEPANEL TOP */}
      <div className={style.top}>
        <div className={style.topContent}>
          <SVG name={SvgIcons.Logo} className={style.logoIcon} />
          <div className={style.title}>WALLET<span className={style.visor}>VISOR</span></div>
        </div>
        <Divider />
      </div>

      {/* SIDEPANEL ROUTES LINKS */}
      <List className={style.principalRoutesList}>
        {principalRoutesList.map((listItem) => (
          <ListItem
            key={listItem.path} 
            button 
            selected={listItem.path === location.pathname.replace('/', '')} 
            onClick={() => history.push(listItem.path)}
          >
            <ListItemIcon> <SVG name={listItem.svg} className={style.icon} /> </ListItemIcon>
            <ListItemText primary={listItem.text} />
          </ListItem>
        ))}
      </List>

      {/* SIDEPANEL BOTTOM */}
      <div className={style.bottom}>

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
    </SwipeableDrawer>
  );
};

export default PhoneSidePanel;
