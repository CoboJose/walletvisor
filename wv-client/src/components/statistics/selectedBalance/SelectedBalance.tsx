import React from 'react';
import logger from 'utils/logger';
import style from './SelectedBalance.module.scss';
//import { useAppSelector } from 'store/hooks';
import { BarChart, Bar, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  
  /////////
  // JSX //
  /////////
  return (
    <div className={style.SelectedBalance}>
      
      <BarChart width={400} height={250} data={getData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis label={{ value: '€', angle: 0, position: 'insideLeft', fill: style.primary }} />
        <Tooltip contentStyle={{ color: style.primary }} />
        <Legend />
        <Bar dataKey="Incomes" unit="€" fill={style.success} label={{ position: 'insideTop' }} />
        <Bar dataKey="Expenses" unit="€" fill={style.error} label={{ position: 'insideTop' }} />
      </BarChart>

    </div>
  );
};

export default SelectedBalance;
