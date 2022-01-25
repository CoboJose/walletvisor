/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import logger from 'utils/logger';
import style from './SelectedCategories.module.scss';
import { Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppSelector } from 'store/hooks';
import { SvgIcons, TransactionKind } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import { transactionCategoriesData } from 'utils/transactionCategories';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

type SelectedCategoriesProps = {
  transactionKind: TransactionKind,
}

const SelectedCategories = ({ transactionKind }: SelectedCategoriesProps): JSX.Element => {
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
    const res: { Category: string; Amount: number }[] = [];

    for (const trn of transactions) {
      const trnCategory = trn.category;
      const trnAmount = trn.amount;
      const trnKind = trn.kind;

      if (trnKind === transactionKind) {
        const category = res.find((r) => r.Category === trnCategory);
        if (category) {
          category.Amount += trnAmount;
        } else {
          res.push({ Category: trnCategory, Amount: trnAmount });
        }
      }
    }

    if (res.length === 0) {
      res.push({ Category: 'No Transactions', Amount: 1 });
    }

    return res;
  };
  const data = getData();

  const renderCustomLabel = (pieData: any) => {
    return (
      <g>
        <text x={pieData.x} y={pieData.y} fill={pieData.fill} textAnchor={pieData.x > pieData.cx ? 'start' : 'end'} dominantBaseline="central" fontSize="1em">
          {`${pieData.Amount}€`}
        </text>
        <text x={pieData.x} y={pieData.y + 15} fill={pieData.fill} textAnchor={pieData.x > pieData.cx ? 'start' : 'end'} dominantBaseline="central" fontSize="0.6em">
          {`${(pieData.percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  const renderCustomLegend = (value: string) => {
    const text = value.charAt(0).toUpperCase() + value.slice(1);
    const category = transactionCategoriesData.find((c) => c.key === value);
    return <span><SVG name={category ? category.svg : SvgIcons.QuestionMark} className={style.svg} /> {text}</span>;
  };

  //////////////
  // HANDLERS //
  //////////////
  
  /////////
  // JSX //
  /////////
  return (
    <ResponsiveContainer height="100%" width="100%" className={style.selectedCategories}>
      <PieChart>
        <Pie data={data} dataKey="Amount" nameKey="Category" label={renderCustomLabel} paddingAngle={5} innerRadius="60%" outerRadius="80%">
          {data.map((entry) => (
            <Cell key={entry.Category} fill={entry.Category !== 'No Transactions' ? style[entry.Category + 'Color'] : style.primary} />
          ))}
        </Pie>
        <br />
        <Legend formatter={renderCustomLegend} iconSize={0} wrapperStyle={{ paddingTop: '25px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SelectedCategories;
