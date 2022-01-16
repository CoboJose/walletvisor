/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import logger from 'utils/logger';
import style from './SelectedBalance.module.scss';
import { BarChart, Bar, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { useAppSelector } from 'store/hooks';
import { TransactionKind } from 'types/types';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

const SelectedBalance = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const transactions = useAppSelector((state) => state.transactions.transactions);

  ///////////
  // STATE //
  ///////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const getData = () => {
    const res: { Incomes: number; Expenses: number; }[] = [{ Incomes: 0, Expenses: 0 }];

    for (const trn of transactions) {
      const trnType = trn.kind;
      const trnAmount = trn.amount;

      if (trnType === TransactionKind.Income) {
        res[0].Incomes += trnAmount;
      } else {
        res[0].Expenses += trnAmount;
      }
    }
    return res;
  };

  //////////////
  // HANDLERS //
  //////////////
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const income = payload[0].value;
      const expense = payload[1].value;
      const balance = income - expense;

      return (
        <div className={style.customTooltipWrapper}>
          <div className={style.customTooltipContent}>
            <p className={style.balance}>Balance: {balance}€</p>
            <p className={style.income}>Income: {income}€</p>
            <p className={style.expense}>Expense: {expense}€</p>
          </div>
        </div>
      );
    }
  
    return null;
  };

  /////////
  // JSX //
  /////////
  return (
    <ResponsiveContainer height="100%" width="100%" className={style.selectedBalance}>
      <BarChart data={getData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis label={{ value: '€', angle: 0, position: 'insideLeft', fill: style.primary }} />
        <Tooltip contentStyle={{ color: style.primary }} content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Incomes" unit="€" fill={style.success} label={{ position: 'insideTop' }} />
        <Bar dataKey="Expenses" unit="€" fill={style.error} label={{ position: 'insideTop' }} />
        <Line type="monotone" dataKey="Incomes" stroke="red" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SelectedBalance;
