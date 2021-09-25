import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import LinearProgress from '@material-ui/core/LinearProgress';
import style from './LoadingTopBar.module.scss';

const LoadingTopBar = (): JSX.Element => {
  logger.rendering();

  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return (
    <>
      { isLoading ? (
        <div className={style.loadingTopBar}> 
          <LinearProgress color="primary" />
        </div>
      ) : null }
    </>
  );
};

export default LoadingTopBar;
