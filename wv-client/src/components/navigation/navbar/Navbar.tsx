import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';

import style from './Navbar.module.scss';

const Navbar = (): JSX.Element => {
  logger.rendering();

  const history = useHistory();

  const [selected, setSelected] = useState<string>('favorites');

  const handleChange = (event: ChangeEvent<unknown>, newValue: string) => {
    event.preventDefault();

    history.push(newValue);

    setSelected(newValue);
  };

  return (
    <div className={style.navbar}>
      <BottomNavigation value={selected} showLabels onChange={handleChange} className={style.root}>
        <BottomNavigationAction label="Transactions" value="transactions" icon={<SVG name="home" className={style.icon} />} />
        <BottomNavigationAction label="Favorites" value="favorites" icon={<SVG name="food" className={style.icon} />} />
        <BottomNavigationAction label="Nearby" value="nearby" icon={<SVG name="lock" className={style.icon} />} />
        <BottomNavigationAction label="Menu" value="menu" icon={<SVG name="edit" className={style.icon} />} />
      </BottomNavigation>
    </div>
  );
};

export default Navbar;
