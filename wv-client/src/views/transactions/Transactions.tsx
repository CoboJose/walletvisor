import React from 'react';

import logger from 'utils/logger';

import Balance from 'components/transactions/balance/Balance';
import TransactionForm from 'components/forms/transactions/TransactionForm';

import style from './Transactions.module.scss';

const Transactions: React.FC = () => {
  logger.rendering();

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
    <div className={style.transactions}>
      <Balance />
      <div className={style.transactionForm}>
        <TransactionForm />
      </div>
    </div>
  );
};

export default Transactions;
