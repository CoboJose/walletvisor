import React from 'react';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';

import { NavbarProps } from '../Navbar';
import style from './MobileNavbar.module.scss';

const MobileNavbar = ({ onClickHandler, principalRoutesList, selected } : NavbarProps): JSX.Element => {
  logger.rendering();

  return (
    <div className={style.navbar}>
      <BottomNavigation value={selected} showLabels onChange={(_, newValue) => onClickHandler(newValue)} className={style.root}>
        {principalRoutesList.map((listItem) => (
          <BottomNavigationAction key={listItem.path} label={listItem.text} value={listItem.path} icon={<SVG name={listItem.svg} className={style.icon} />} />
        ))}
      </BottomNavigation>
    </div>
  );
};

export default MobileNavbar;
