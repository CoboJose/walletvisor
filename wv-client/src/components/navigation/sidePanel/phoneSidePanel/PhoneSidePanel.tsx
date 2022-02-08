import React from 'react';
import SVG from 'components/ui/svg/SVG';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeTheme } from 'store/slices/config';
import { SidePanelListItems } from 'components/navigation/sidePanel/SidePanel';
import logger from 'utils/logger';
import UserIcon from 'components/navigation/userIcon/UserIcon';
import { SvgIcons } from 'types/types';

import { Divider, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, IconButton } from '@mui/material';

import style from './PhoneSidePanel.module.scss';
import { getGroups, setSelectedGroup } from 'store/slices/groups';

type PhoneSidePanelProps = {
  principalRoutesList: SidePanelListItems[],
  phoneSidePanelOpen: boolean,
  handlePhoneSidePanelOpen: () => void,
  handlePhoneSidePanelClose: () => void,
}

const PhoneSidePanel = ({ principalRoutesList, phoneSidePanelOpen, handlePhoneSidePanelOpen, handlePhoneSidePanelClose }: PhoneSidePanelProps): JSX.Element => {
  logger.rendering();
  
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const theme = useAppSelector((state) => state.config.theme);

  const iOS = new RegExp(/iPad|iPhone|iPod/).test(navigator.userAgent);

  const onRouteClickHandler = (listItem: SidePanelListItems) => {
    history.push(listItem.path);
    handlePhoneSidePanelClose();
    dispatch(setSelectedGroup(null));
    dispatch(getGroups());
  };

  return (
    <SwipeableDrawer
      className={style.phoneSidePanel}
      classes={{ paper: style.phoneSidePanelPaper }}
      open={phoneSidePanelOpen}
      onClose={handlePhoneSidePanelClose}
      onOpen={handlePhoneSidePanelOpen}
      disableBackdropTransition
      disableDiscovery={iOS}
      swipeAreaWidth={27}
    >
      {/* SIDEPANEL TOP */}
      <div 
        className={style.top}
        role="presentation"
      >
        <div className={style.userIcon}>
          <UserIcon size="50px" />
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
            onClick={() => onRouteClickHandler(listItem)}
          >
            <ListItemIcon> <SVG name={listItem.svg} className={style.icon} /> </ListItemIcon>
            <ListItemText primary={listItem.text} />
          </ListItem>
        ))}
      </List>

      {/* SIDEPANEL BOTTOM */}
      <div className={style.bottom}>

        <Divider />

        <IconButton
          className={style.themeButton}
          onClick={() => dispatch(changeTheme())}
          size="large"
        >
          <SVG name={theme === 'dark' ? SvgIcons.Sun : SvgIcons.Moon} className={style.themeIcon} />
        </IconButton>
        
      </div>
    </SwipeableDrawer>
  );
};

export default PhoneSidePanel;
