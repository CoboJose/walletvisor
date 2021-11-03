import React from 'react';
import { useAppSelector } from 'store/hooks';
import { SvgIcons, Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import math from 'utils/math';
import SVG from 'components/ui/svg/SVG';

import Paper from '@material-ui/core/Paper';

import style from './Balance.module.scss';

const Balance = (): JSX.Element => {
  logger.rendering();

  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);
  const totalBalance: number = useAppSelector((state) => state.transactions.totalBalance);

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
    <Paper className={style.balance}>
      
      <div className={style.balanceText}>
        Balance
      </div>

      <div className={style.income}>
        <SVG name={SvgIcons.Add} className={style.plusIcon} />
        <span> {math.round(Math.abs(income), 2)} € </span>
      </div>

      <div className={style.expense}>
        <SVG name={SvgIcons.Line} className={style.lessIcon} />
        <span> {math.round(Math.abs(expense), 2)} € </span>
      </div>

      <div className={`${style.balanceTotal} ${balance >= 0 ? style.positive : style.negative}`}>
        {balance >= 0 ? <SVG name={SvgIcons.Add} className={style.plusIcon} /> : <SVG name={SvgIcons.Line} className={style.lessIcon} />}
        <span> {math.round(Math.abs(balance), 2)} € </span>
      </div>

      <div>
        <span> {math.round(Math.abs(totalBalance), 2)} € </span>
      </div>

    </Paper>
  );
};

export default Balance;
