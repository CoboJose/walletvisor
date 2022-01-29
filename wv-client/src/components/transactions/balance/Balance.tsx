import React from 'react';
import { useAppSelector } from 'store/hooks';
import { Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import math from 'utils/math';
import dates from 'utils/dates';
import { useMediaQuery } from '@mui/material';
import TransactionsDateRange from 'components/transactions/transactionsDateRange/TransactionsDateRange';
import Paper from '@mui/material/Paper';
import style from './Balance.module.scss';
import ButtonAddTransaction from 'components/navigation/modalButtons/ButtonAddTransaction';
import ButtonDateRange from 'components/navigation/modalButtons/ButtonDateRange';
import FilterByCategoriesButton from 'components/navigation/modalButtons/ButtonfilterByCategories';

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

const Balance = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const isPhone = useMediaQuery('(max-width:' + style.intermediateWidth + ')');

  ///////////
  // STATE //
  ///////////
  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);
  const totalBalance: number = useAppSelector((state) => state.transactions.totalBalance);
  const fromDate = useAppSelector((state) => state.transactions.fromDate);
  const toDate = useAppSelector((state) => state.transactions.toDate);

  const [balance, income, expense] = getAmounts(transactions);
  const dateRange = dates.getDateRangeString(fromDate, toDate);
  
  /////////
  // JSX //
  /////////
  return (
    <Paper className={style.balance}>
      
      <div className={style.dateRange}>
        <div className={style.text}>{dateRange}</div>
        <div className={style.income}>+ {math.formatEurNumber(income)}</div>
        <div className={style.expense}>- {math.formatEurNumber(expense)}</div>
      </div>
      
      {!isPhone && (
      <div className={style.dateRangeSelector}>
        <div className={style.dateRangeInputs}>
          <TransactionsDateRange variant="standard" />
        </div>
      </div>
      )}

      <div className={style.balances}>
        <div className={`${style.rangeBalance} ${balance >= 0 ? style.positive : style.negative}`}>
          {balance >= 0 ? '+' : '-'} {math.formatEurNumber(balance)}
        </div>

        <div className={`${style.totalBalance} ${balance >= 0 ? style.positive : style.negative}`}>
          <span className={style.text}>Total: </span> 
          <span className={style.amount}> {balance >= 0 ? '+' : '-'} {math.formatEurNumber(totalBalance)} </span>
        </div>
      </div>

      <div className={style.actionButtons}>
        <ButtonAddTransaction isPhone={isPhone} />
        {isPhone && <ButtonDateRange />}
        <FilterByCategoriesButton isPhone={isPhone} />
      </div>

    </Paper>
  );
};

export default Balance;
