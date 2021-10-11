import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getTransactions } from 'store/slices/transactions';
import { logout } from 'store/slices/auth';
import { changeTheme } from 'store/slices/config';
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

      <button type="button" onClick={() => dispatch(logout())}>Log Out</button>
      <button type="button" onClick={() => dispatch(changeTheme())}>Change theme</button>
    </div>
  );
};

export default Transactions;
