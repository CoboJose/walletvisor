import React from 'react';
import { useLocation } from 'react-router-dom';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';

import SVG from 'components/ui/svg/SVG';

import style from './TopBar.module.scss';

type TopBarProps = {
  handlePhoneSidePanelOpen: () => void,
}

const TopBar = ({ handlePhoneSidePanelOpen }: TopBarProps): JSX.Element => {
  logger.rendering();

  const location = useLocation();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  const selected = location.pathname.replace('/', '');

  return (
    <AppBar position="fixed" className={style.topBar}>
      <Toolbar className={style.topBar}>
        
        <IconButton
          edge="start"
          onClick={handlePhoneSidePanelOpen}
        >
          <SVG name={SvgIcons.ThreeLines} className={style.icon} />
        </IconButton>

        {isPhone ? (
          <div className={style.text}>
            {selected}
          </div>
        ) : (
          <></>
        )}
        
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
