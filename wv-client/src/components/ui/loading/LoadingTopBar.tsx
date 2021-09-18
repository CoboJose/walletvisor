import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import LinearProgress from '@material-ui/core/LinearProgress';

const LoadingTopBar = (): JSX.Element => {
  logger.rendering();

  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return (
    <>
      { isLoading ? (
        <LinearProgress color="primary" />
      ) : null }
    </>
  );
};

export default LoadingTopBar;
