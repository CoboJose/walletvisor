import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';

import LinearProgress from '@mui/material/LinearProgress';
import style from './LoadingTopBar.module.scss';

const LoadingTopBar = (): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const isLoadingAuth = useAppSelector((state) => state.auth.isLoading);
  const isLoadingTransactions = useAppSelector((state) => state.transactions.isLoading);
  const isLoadingConfig = useAppSelector((state) => state.config.isLoading);
  const isLoading = isLoadingAuth || isLoadingTransactions || isLoadingConfig;

  /////////
  // JSX //
  /////////
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
