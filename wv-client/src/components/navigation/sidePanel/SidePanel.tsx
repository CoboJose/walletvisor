import React from 'react';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import { useMediaQuery, useTheme } from '@mui/material';

import DesktopSidePanel from './desktopSidePanel/DesktopSidePanel';
import PhoneSidePanel from './phoneSidePanel/PhoneSidePanel';

export type SidePanelListItems = { text: string, path: string, svg: SvgIcons }
const principalRoutesList: SidePanelListItems[] = [
  {
    text: 'Transactions',
    path: 'transactions',
    svg: SvgIcons.Exchange,
  },
  {
    text: 'Statistics',
    path: 'statistics',
    svg: SvgIcons.Chart,
  },
  {
    text: 'Configuration',
    path: 'configuration',
    svg: SvgIcons.Settings,
  },
  {
    text: 'About',
    path: 'about',
    svg: SvgIcons.Info,
  },
];

type SidePanelProps = {
  phoneSidePanelOpen: boolean,
  handlePhoneSidePanelOpen: () => void,
  handlePhoneSidePanelClose: () => void,
}

const SidePanel = ({ phoneSidePanelOpen, handlePhoneSidePanelOpen, handlePhoneSidePanelClose }: SidePanelProps): JSX.Element => {
  logger.rendering();

  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));
  
  return (
    <div>
      {isPhone ? (
        <PhoneSidePanel 
          principalRoutesList={principalRoutesList} 
          phoneSidePanelOpen={phoneSidePanelOpen} 
          handlePhoneSidePanelOpen={handlePhoneSidePanelOpen} 
          handlePhoneSidePanelClose={handlePhoneSidePanelClose} 
        />
      ) : (
        <DesktopSidePanel principalRoutesList={principalRoutesList} />
      )}
    </div>
  );
};

export default SidePanel;
