import React from 'react';
import { useAppSelector } from 'store/hooks';
import { Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import math from 'utils/math';
import dates from 'utils/dates';

import Paper from '@mui/material/Paper';

import style from './Balance.module.scss';

const Balance = (): JSX.Element => {
  logger.rendering();

  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);
  const totalBalance: number = useAppSelector((state) => state.transactions.totalBalance);
  const fromDate = useAppSelector((state) => state.transactions.fromDate);
  const toDate = useAppSelector((state) => state.transactions.toDate);

  let balance = 0;
  let income = 0;
  let expense = 0;

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

  [balance, income, expense].map((e) => math.round(e, 2));

  const dateRange = (): string => {
    let res = '';
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
  
  return (
    <Paper className={style.balance}>
      
      <div className={style.balanceText}>
        Balance
        <div className={style.dateRange}>{dateRange()}</div>
      </div>

      <div className={style.income}>
        + {math.round(Math.abs(income), 2)}€
      </div>

      <div className={style.expense}>
        - {math.round(Math.abs(expense), 2)}€
      </div>

      <div className={`${style.rangeBalance} ${balance >= 0 ? style.positive : style.negative}`}>
        {balance >= 0 ? '+' : '-'} {math.round(Math.abs(balance), 2)}€
      </div>

      <div className={`${style.totalBalance} ${balance >= 0 ? style.positive : style.negative}`}>
        <span className={style.text}>Total Balance:</span> 
        <span className={style.amount}> {balance >= 0 ? '+' : '-'} {math.round(Math.abs(totalBalance), 2)}€ </span>
      </div>

    </Paper>
  );
};

export default Balance;
