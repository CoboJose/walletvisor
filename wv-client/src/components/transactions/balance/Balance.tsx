import React from 'react';
import { useAppSelector } from 'store/hooks';
import { Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import math from 'utils/math';
import dates from 'utils/dates';
import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsDateRange from 'components/transactions/transactionsDateRange/TransactionsDateRange';

import Paper from '@mui/material/Paper';

import style from './Balance.module.scss';
import ButtonDateRange from 'components/ui/dateRange/ButtonDateRange';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////
const getAmounts = (transactions: Transaction[]): number[] => {
  let [balance, income, expense] = [0, 0, 0];

  for (const t of transactions) {
    if (t.kind === TransactionKind.Expense) {
      balance += -t.amount; 
      expense += t.amount;
    } 
    else {
      balance += t.amount;
      income += t.amount;
    }
  }

  return [balance, income, expense].map((e) => math.round(e, 2));
};

const formatNumber = (n: number): string => {
  return Number(math.round(Math.abs(n), 2)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

const getDateRange = (fromDate: number|null, toDate: number|null): string => {
  let res = 'All time transactions';
  if (fromDate !== null && toDate === null) {
    res = 'from ' + dates.timestampToStringDate(fromDate);
  }
  else if (fromDate === null && toDate !== null) {
    res = 'to ' + dates.timestampToStringDate(toDate);
  }
  else if (fromDate !== null && toDate !== null) {
    res = dates.timestampToStringDate(fromDate) + ' - ' + dates.timestampToStringDate(toDate);
  }

  return res;
};

const Balance = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////
  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);
  const totalBalance: number = useAppSelector((state) => state.transactions.totalBalance);
  const fromDate = useAppSelector((state) => state.transactions.fromDate);
  const toDate = useAppSelector((state) => state.transactions.toDate);

  const [balance, income, expense] = getAmounts(transactions);
  const dateRange = getDateRange(fromDate, toDate);
  
  /////////
  // JSX //
  /////////
  return (
    <Paper className={style.balance}>
      
      <div className={style.dateRange}>
        <div className={style.text}>{dateRange}</div>
        <div className={style.income}>+ {formatNumber(income)}</div>
        <div className={style.expense}>- {formatNumber(expense)}</div>
      </div>

      <div className={style.dateRangeSelector}>
        {isPhone ? (
          <ButtonDateRange />
        ) : (
          <div className={style.dateRangeInputs}>
            <TransactionsDateRange variant="standard" />
          </div>
        )}
      </div>

      <div className={style.balances}>
        <div className={`${style.rangeBalance} ${balance >= 0 ? style.positive : style.negative}`}>
          {balance >= 0 ? '+' : '-'} {formatNumber(balance)}
        </div>

        <div className={`${style.totalBalance} ${balance >= 0 ? style.positive : style.negative}`}>
          <span className={style.text}>Total: </span> 
          <span className={style.amount}> {balance >= 0 ? '+' : '-'} {formatNumber(totalBalance)} </span>
        </div>
      </div>

    </Paper>
  );
};

export default Balance;
