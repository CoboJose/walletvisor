import React from 'react';
import SVG from 'components/ui/svg/SVG';
import { useHistory, useLocation } from 'react-router-dom';
import { SvgIcons } from 'types/types';
import { SidePanelListItems } from 'components/navigation/sidePanel/SidePanel';
import logger from 'utils/logger';

import { Divider, List, ListItem, ListItemIcon, ListItemText, Drawer, Link } from '@material-ui/core';

import style from './DesktopSidePanel.module.scss';

type DesktopSidePanelProps = {
  principalRoutesList: SidePanelListItems[],
}

const DesktopSidePanel = ({ principalRoutesList }: DesktopSidePanelProps): JSX.Element => {
  logger.rendering();
  
  const history = useHistory();
  const location = useLocation();

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
        <div className={style.bottomContent}>

          <div className={style.links}>
            <Link href="https://github.com/CoboJose/walletvisor"> GitHub </Link>
            <Link href="https://www.linkedin.com/in/jose-cobo/"> LinkedIn </Link>
            <Link href="mailto: cobogue@gmail.com"> Email Me </Link>
          </div>

          <span className={style.legal}> WalletVisor© 2021 </span>

        </div>
      </div>
    </Drawer>
  );
};

export default DesktopSidePanel;
