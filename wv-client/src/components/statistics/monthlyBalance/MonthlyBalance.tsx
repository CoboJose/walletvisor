import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';
import style from './MonthlyBalance.module.scss';
//import { useAppSelector } from 'store/hooks';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Line, ReferenceLine } from 'recharts';
import dates from 'utils/dates';
import { ApiError, Transaction, TransactionKind } from 'types/types';
import api from 'api/api';
import apiErrors from 'api/apiErrors';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

const MonthlyBalance = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////

  ///////////
  // STATE //
  ///////////
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const from = dates.getFirstDayOfNMonthAgo(3).getTime();
    const to = dates.getLastDayOfCurrentMonth().getTime();
    api.getTransactions(from, to)
      .then((res) => {
        setTransactions(res.transactions.sort((t1, t2) => t1.date - t2.date));
      })
      .catch((error) => {
        const err = error as ApiError;
        logger.error(apiErrors(err.code));
      });
  }, []);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const getData = () => {
    const res: { Month: string; Incomes: number; Expenses: number; Balance: number }[] = [];

    for (const trn of transactions) {
      const trnMonth = dates.getMonthString(new Date(trn.date));
      const trnType = trn.kind;
      const trnAmount = trn.amount;

      const month = res.find((r) => r.Month === trnMonth);
      if (month) {
        if (trnType === TransactionKind.Income) {
          month.Incomes += trnAmount;
          month.Balance += trnAmount;
        } else {
          month.Expenses -= trnAmount;
          month.Balance -= trnAmount;
        }
      } else {
        const newMonthEntry = { Month: trnMonth, Incomes: 0, Expenses: 0, Balance: 0 };
        if (trnType === TransactionKind.Income) {
          newMonthEntry.Incomes = trnAmount;
          newMonthEntry.Balance = trnAmount;
        } else {
          newMonthEntry.Expenses = -trnAmount;
          newMonthEntry.Balance = -trnAmount;
        }
        res.push(newMonthEntry);
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
    <div className={style.monthlyBalance}>

      <ComposedChart
        width={500}
        height={400}
        data={getData()}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Month" scale="band" />
        <YAxis label={{ value: '€', angle: 0, position: 'insideLeft', fill: style.primary }} />
        <Tooltip contentStyle={{ color: style.primary }} />
        <Legend />
        <ReferenceLine y={0} stroke={style.info} />
        <Bar dataKey="Incomes" unit="€" fill={style.success} label={{ position: 'insideTop' }} barSize={20} />
        <Bar dataKey="Expenses" unit="€" fill={style.error} label={{ position: 'insideTop' }} barSize={20} />
        <Line type="monotone" dataKey="Balance" stroke={style.primary} />
      </ComposedChart>

    </div>
  );
};

export default MonthlyBalance;
