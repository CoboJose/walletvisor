import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getTransactions } from 'store/slices/transactions';
import logger from 'utils/logger';
import Balance from 'components/transactions/balance/Balance';
import TransactionsList from 'components/transactions/transactionsList/TransactionsList';

import style from './Transactions.module.scss';

const Transactions: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();
  ///////////
  // STATE //
  ///////////

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    dispatch(getTransactions());
  }, []);
  
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
      <Balance />
      
      <TransactionsList />
    </div>
  );
};

export default Transactions;
