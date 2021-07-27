import React from 'react';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';
import style from './LoadingTopBar.module.scss';

const LoadingTopBar = (): JSX.Element => {
  logger.rendering();

  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return (
    <>
      { isLoading ? (
        <div className={style.slider}>
          <div className={style.line} />
          <div className={`${style.subline} ${style.inc}`} />
          <div className={`${style.subline} ${style.dec}`} />
        </div>
      ) : null }
    </>
  );
};

export default LoadingTopBar;
