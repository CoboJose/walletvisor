import React from 'react';
import SVG from 'components/ui/svg/SVG';
import { useHistory, useLocation } from 'react-router-dom';
import { SvgIcons } from 'types/types';
import { SidePanelListItems } from 'components/navigation/sidePanel/SidePanel';
import logger from 'utils/logger';

import { Divider, List, ListItem, ListItemIcon, ListItemText, Drawer, Link } from '@mui/material';

import style from './DesktopSidePanel.module.scss';
import { useAppDispatch } from 'store/hooks';
import { getGroups, setSelectedGroup } from 'store/slices/groups';

type DesktopSidePanelProps = {
  principalRoutesList: SidePanelListItems[],
}

const DesktopSidePanel = ({ principalRoutesList }: DesktopSidePanelProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  //////////////
  // HANDLERS //
  //////////////
  const onRouteClickHandler = (listItem: SidePanelListItems) => {
    history.push(listItem.path);
    dispatch(setSelectedGroup(null));
    dispatch(getGroups());
  };

  /////////
  // JSX //
  /////////
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={style.desktopSidePanel}
      classes={{ paper: style.desktopSidePanelPaper }}
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
        <div className={style.bottomContent}>

          <div className={style.links}>
            <Link href="https://github.com/CoboJose/walletvisor" underline="hover"> GitHub </Link>
            <Link href="https://www.linkedin.com/in/jose-cobo/" underline="hover"> LinkedIn </Link>
            <Link href="mailto: cobogue@gmail.com" underline="hover"> Email Me </Link>
          </div>

          <span className={style.legal}> WalletVisor© 2021 </span>

        </div>
      </div>
    </Drawer>
  );
};

export default DesktopSidePanel;
