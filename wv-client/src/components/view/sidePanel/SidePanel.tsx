import React from 'react';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import { Drawer, Hidden } from '@material-ui/core';

import style from './SidePanel.module.scss';
import DesktopSidePanel from './desktopSidePanel/DesktopSidePanel';
import PhoneSidePanel from './phoneSidePanel/PhoneSidePanel';

export type SidePanelListItems = { text: string, path: string, svg: SvgIcons }
const principalRoutesList: SidePanelListItems[] = [
  {
    text: 'Transactions',
    path: 'transactions',
    svg: SvgIcons.Home,
  },
  {
    text: 'Favourites',
    path: 'favourites',
    svg: SvgIcons.Food,
  },
  {
    text: 'Nearby',
    path: 'nearby',
    svg: SvgIcons.Lock,
  },
  {
    text: 'Menu',
    path: 'menu',
    svg: SvgIcons.Edit,
  },
];

type SidePanelProps = {
  phoneSidePanelOpen: boolean,
  phoneSidePanelOpenHandler: () => void,
}

const SidePanel = ({ phoneSidePanelOpen, phoneSidePanelOpenHandler }: SidePanelProps): JSX.Element => {
  logger.rendering();

  return (
    <div>
      {/* Desktop Drawer */}
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          anchor="left"
          className={style.desktopSidePanel}
          classes={{ paper: style.desktopSidePanelPaper }}
        >
          <DesktopSidePanel principalRoutesList={principalRoutesList} />
        </Drawer>
      </Hidden>

      {/* Phone Drawer */}
      <Hidden xsUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          className={style.phoneSidePanel}
          classes={{ paper: style.phoneSidePanelPaper }}
          ModalProps={{ keepMounted: true }}
          open={phoneSidePanelOpen}
          onClose={phoneSidePanelOpenHandler}
        >
          <PhoneSidePanel principalRoutesList={principalRoutesList} />
        </Drawer>
      </Hidden>
    </div>
  );
};

export default SidePanel;
