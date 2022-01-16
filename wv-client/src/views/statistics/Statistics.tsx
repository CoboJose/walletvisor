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
import dates from 'utils/dates';
import { useAppSelector } from 'store/hooks';

const Statistics: React.FC = () => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const isPhone = useMediaQuery('(max-width:' + style.maxWidth + ')');
  const fromDate = useAppSelector((state) => state.transactions.fromDate);
  const toDate = useAppSelector((state) => state.transactions.toDate);
  const dateRange = dates.getDateRangeString(fromDate, toDate);
  
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
          <div className={style.dateRangeCard}>
            <ButtonDateRange />
          </div>
        ) : (
          <Card className={`${style.card} ${style.dateRangeCard}`} variant="outlined">
            <div className={style.label}>Date Selector</div>
            <div className={style.dateRangeContent}> <TransactionsDateRange variant="standard" /> </div>
          </Card>
        )}

        <Card className={`${style.card} ${style.selectedBalanceCard}`} variant="outlined">
          <div className={style.label}>{isPhone ? ('Balance for (' + dateRange + ')') : ('Balance for Selected Dates')}</div>
          <div className={style.selectedBalanceContent}> <SelectedBalance /> </div>
        </Card>

        <Card className={`${style.card} ${style.monthlyBalanceCard}`} variant="outlined">
          <div className={style.label}>Balance for Last 4 Months</div>
          <div className={style.monthlyBalanceContent}> <MonthlyBalance /> </div>
        </Card>

        <Card className={`${style.card} ${style.selectedCategoriesIncomeCard}`} variant="outlined">
          <div className={style.label}>{isPhone ? ('Incomes Categories Distribution for (' + dateRange + ')') : ('Incomes Categories Distribution for Selected Dates')}</div>
          <div className={style.selectedCategoriesIncomeContent}> <SelectedCategories transactionKind={TransactionKind.Income} /> </div>
        </Card>

        <Card className={`${style.card} ${style.selectedCategoriesExpenseCard}`} variant="outlined">
          <div className={style.label}>{isPhone ? ('Expenses Categories Distribution for (' + dateRange + ')') : ('Expenses Categories Distribution for Selected Dates')}</div>
          <div className={style.selectedCategoriesExpenseContent}> <SelectedCategories transactionKind={TransactionKind.Expense} /> </div>
        </Card>

      </div>
    </div>
  );
};

export default Statistics;
