import React from 'react';
import logger from 'utils/logger';

import style from './Menu.module.scss';

const Menu: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////

  ////////////////
  // USE EFFECT //
  ////////////////
  
  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////

  return (
    <div className={style.transactions}>
      <p>Menu</p>
    </div>
  );
};

export default Menu;
