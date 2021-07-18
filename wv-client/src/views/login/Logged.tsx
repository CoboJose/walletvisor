import React from 'react';

import logger from 'utils/logger';

import { useAppDispatch } from 'store/hooks';
import { logout } from 'store/slices/auth';

const Logged: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();

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
    <div>
      <p>You are logged!</p>
      <button type="button" onClick={() => dispatch(logout())}>Log out</button>
    </div>
  );
};

export default Logged;
