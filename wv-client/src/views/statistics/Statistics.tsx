import React from 'react';
import logger from 'utils/logger';

import style from './Statistics.module.scss';
import SelectedBalance from 'components/statistics/selectedBalance/SelectedBalance';
import TransactionsDateRange from 'components/transactions/transactionsDateRange/TransactionsDateRange';
import { Card, useMediaQuery } from '@mui/material';
import MonthlyBalance from 'components/statistics/monthlyBalance/MonthlyBalance';
import SelectedCategories from 'components/statistics/selectedCategories/SelectedCategories';
import { TransactionKind } from 'types/types';
import ButtonDateRange from 'components/ui/dateRange/ButtonDateRange';

const Statistics: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const isPhone = useMediaQuery('(max-width:' + style.maxWidth + ')');
  
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
      <div className={style.cards}>

        {isPhone ? (
          <div className={style.dateRange}>
            <ButtonDateRange />
          </div>
        ) : (
          <Card className={style.dateRange} variant="outlined">
            <TransactionsDateRange variant="standard" />
          </Card>
        )}

        <Card className={style.selectedBalance} variant="outlined">
          <SelectedBalance />
        </Card>

        <Card className={style.monthlyBalance} variant="outlined">
          <MonthlyBalance />
        </Card>

        <Card className={style.selectedCategoriesIncome} variant="outlined">
          <SelectedCategories transactionKind={TransactionKind.Income} />
        </Card>

        <Card className={style.selectedCategoriesExpense} variant="outlined">
          <SelectedCategories transactionKind={TransactionKind.Expense} />
        </Card>

      </div>
    </div>
  );
};

export default Statistics;
