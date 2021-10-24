import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import DesktopNavbar from './desktopNavbar/DesktopNavbar';
import MobileNavbar from './mobileNavbar/MobileNavbar';

export type NavbarListItems = {
  text: string,
  path: string,
  svg: SvgIcons,
}

export type NavbarProps = {
  onClickHandler: (arg0: string) => void,
  principalRoutesList: NavbarListItems[],
  selected: string,
};

const principalRoutesList: NavbarListItems[] = [
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

const Navbar = (): JSX.Element => {
  logger.rendering();

  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  const selected = location.pathname.replace('/', '');

  //////////////
  // HANDLERS //
  //////////////
  const onClickHandler = (newPath: string) => {
    history.push(newPath);
  };

  return (
    <>
      { isPhone 
        ? <MobileNavbar onClickHandler={onClickHandler} principalRoutesList={principalRoutesList} selected={selected} />
        : <DesktopNavbar onClickHandler={onClickHandler} principalRoutesList={principalRoutesList} selected={selected} />}
    </>
  );
};

export default Navbar;
