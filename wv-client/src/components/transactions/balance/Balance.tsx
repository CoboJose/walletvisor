import React from 'react';
import { useAppSelector } from 'store/hooks';
import { Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import math from 'utils/math';

import style from './Balance.module.scss';

const Balance = (): JSX.Element => {
  logger.rendering();

  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);

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
  
  return (
    <div className={style.balance}>

      <div className={style.balanceTotal}>
        <span className={style.title}>Balance</span>
        <span className={style.amount}>{balance} €</span>
      </div>
      
      <div className={style.income}>
        <span className={style.title}>Income</span> 
        <span className={style.amount}>{income} €</span>
      </div>

      <div className={style.expense}>
        <span className={style.title}>Expense</span> 
        <span className={style.amount}>{expense} €</span>
      </div>

    </div>
  );
};

export default Balance;
