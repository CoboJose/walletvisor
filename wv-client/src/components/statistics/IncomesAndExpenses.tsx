import React from 'react';
import logger from 'utils/logger';
import style from './IncomesAndExpenses.module.scss';
//import { useAppSelector } from 'store/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

const IncomesAndExpenses = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  //const transactions = useAppSelector((state) => state.transactions.transactions);

  ///////////
  // STATE //
  ///////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const getData = () => {
    return [
      {
        name: 'November',
        incomes: 4000,
        expenses: 2400
      },
      {
        name: 'December',
        incomes: 2000,
        expenses: 3000
      },
    ];
  };

  //////////////
  // HANDLERS //
  //////////////
  
  /////////
  // JSX //
  /////////
  return (
    <div className={style.statistics}>
      
      <BarChart width={730} height={250} data={getData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="incomes" fill="#8884d8" />
        <Bar dataKey="expenses" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default IncomesAndExpenses;
