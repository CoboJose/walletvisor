import React, { Dispatch, SetStateAction } from 'react';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import { Hidden } from '@material-ui/core';

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
  phoneSidePanelOpenHandler: (arg0: boolean) => void,
}

const SidePanel = ({ phoneSidePanelOpen, phoneSidePanelOpenHandler }: SidePanelProps): JSX.Element => {
  logger.rendering();

  return (
    <div>
      {/* Desktop Drawer */}
      <Hidden xsDown implementation="css">
        <DesktopSidePanel principalRoutesList={principalRoutesList} />
      </Hidden>

      {/* Phone Drawer */}
      <Hidden xsUp implementation="css">
        <PhoneSidePanel principalRoutesList={principalRoutesList} open={phoneSidePanelOpen} openHandler={phoneSidePanelOpenHandler} />
      </Hidden>
    </div>
  );
};

export default SidePanel;
