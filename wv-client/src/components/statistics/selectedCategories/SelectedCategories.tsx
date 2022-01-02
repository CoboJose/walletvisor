import React from 'react';
import logger from 'utils/logger';
import style from './SelectedCategories.module.scss';
import { Legend, PieChart, Pie, Cell } from 'recharts';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = (pieData: any) => {
    console.log(pieData);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className={style.selectedCategories}>

      <PieChart width={350} height={450}>
        <Pie data={data} dataKey="Amount" nameKey="Category" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label={renderCustomLabel}>
          {data.map((entry) => (
            <Cell key={entry.Category} fill={entry.Category !== 'No Transactions' ? style[entry.Category + 'Color'] : style.primary} />
          ))}
        </Pie>
        <Legend formatter={renderCustomLegend} iconSize={0} />
      </PieChart>

    </div>
  );
};

export default SelectedCategories;
