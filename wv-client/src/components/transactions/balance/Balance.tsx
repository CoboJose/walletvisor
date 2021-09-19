import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

const Balance = (): JSX.Element => {
  logger.rendering();

  return (
    <div>
      <p>Balance</p>
    </div>
  );
};

export default Balance;
