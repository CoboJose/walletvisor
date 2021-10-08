import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { getTransactions } from 'store/slices/transactions';
import { logout } from 'store/slices/auth';
import { changeTheme } from 'store/slices/config';
import logger from 'utils/logger';
import Balance from 'components/transactions/balance/Balance';
import TransactionForm from 'components/transactions/transactionForm/TransactionForm';
import TransactionFormModal from 'components/transactions/transactionForm/TransactionFormModal';
import TransactionsList from 'components/transactions/transactionsList/TransactionsList';

import Button from '@material-ui/core/Button';

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
      {/* <Balance /> */}

      <Button
        variant="contained"
        color="primary"
      >
        Add Transaction
      </Button>

      <TransactionFormModal transactionToUpdate={null} />
      
      <TransactionsList />

      <button type="button" onClick={() => dispatch(logout())}>Log Out</button>
      <button type="button" onClick={() => dispatch(changeTheme())}>Change theme</button>
    </div>
  );
};

export default Transactions;
