import React from 'react';
import logger from 'utils/logger';

import style from './Statistics.module.scss';
import SelectedBalance from 'components/statistics/selectedBalance/SelectedBalance';
import TransactionsDateRange from 'components/transactions/transactionsDateRange/TransactionsDateRange';
import { Card } from '@mui/material';
import MonthlyBalance from 'components/statistics/monthlyBalance/MonthlyBalance';
import SelectedCategories from 'components/statistics/selectedCategories/SelectedCategories';
import { TransactionKind } from 'types/types';

const Statistics: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  
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
    <div className={style.statistics}>

      <Card className={style.dateRange} variant="outlined">
        <TransactionsDateRange variant="standard" />
      </Card>

      <div className={style.charts}>

        <Card className={style.selectedBalance} variant="outlined">
          <SelectedBalance />
        </Card>

        <Card className={style.monthlyBalance} variant="outlined">
          <MonthlyBalance />
        </Card>

        <Card className={style.selectedCategories} variant="outlined">
          <SelectedCategories transactionKind={TransactionKind.Income} />
        </Card>

        <Card className={style.selectedCategories} variant="outlined">
          <SelectedCategories transactionKind={TransactionKind.Expense} />
        </Card>

      </div>

    </div>
  );
};

export default Statistics;
