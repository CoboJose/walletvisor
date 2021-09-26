import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getTransactions } from 'store/slices/transactions';
import logger from 'utils/logger';
import Balance from 'components/transactions/balance/Balance';
import TransactionForm from 'components/forms/transactions/TransactionForm';
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
      <div className={style.transactionForm}>
        <TransactionForm />
      </div>
      <TransactionsList />
    </div>
  );
};

export default Transactions;
