import React from 'react';
import { useLocation } from 'react-router-dom';
import logger from 'utils/logger';
import { SvgIcons } from 'types/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeTheme } from 'store/slices/config';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';

import SVG from 'components/ui/svg/SVG';

import style from './TopBar.module.scss';
import UserIcon from '../userIcon/UserIcon';

type TopBarProps = {
  handlePhoneSidePanelOpen: () => void,
}

const TopBar = ({ handlePhoneSidePanelOpen }: TopBarProps): JSX.Element => {
  logger.rendering();

  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.config.theme);

  const location = useLocation();
  const muiTheme = useTheme();
  const isPhone = useMediaQuery(muiTheme.breakpoints.only('xs'));

  const selected = location.pathname.replace('/', '');

  return (
    <AppBar position="fixed" className={style.topBar}>
      <Toolbar className={style.toolbar}>
        
        {isPhone && (
          <IconButton edge="start" onClick={handlePhoneSidePanelOpen} size="large">
            <SVG name={SvgIcons.ThreeLines} className={style.sidePanelIcon} />
          </IconButton>
        )}

        <div className={style.text}>
          {selected}
        </div>

        {!isPhone && (
          <div className={style.rightSide}>

            <Tooltip title="Change Theme">
              <IconButton
                className={style.themeButton}
                onClick={() => dispatch(changeTheme())}
                size="large"
              >
                <SVG name={theme === 'dark' ? SvgIcons.Sun : SvgIcons.Moon} className={style.themeIcon} />
              </IconButton>
            </Tooltip>
            
            <UserIcon size="25px" />

          </div>
        )}
        
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
