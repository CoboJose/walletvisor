import React from 'react';

import logger from 'utils/logger';

import Balance from 'components/transactions/balance/Balance';
import TransactionForm from 'components/forms/transactions/TransactionForm';

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
    <div>
      <Balance />
      <TransactionForm />
    </div>
  );
};

export default Transactions;
