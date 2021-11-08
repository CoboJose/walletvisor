import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeTransactionsRangeAction } from 'store/slices/transactions';
import logger from 'utils/logger';
import DateRange from 'components/ui/dateRange/DateRange';

import style from './TransactionsDateRange.module.scss';

type TransactionsDateRangeProps = {
  variant: 'standard' | 'filled' | 'outlined' | undefined,
}

const TransactionsDateRange = ({ variant }: TransactionsDateRangeProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const sliceFromDate = useAppSelector((state) => state.transactions.fromDate);
  const sliceToDate = useAppSelector((state) => state.transactions.toDate);

  const [formFromDate, setFormFromDate] = useState<Date | null>(sliceFromDate !== null ? new Date(sliceFromDate) : null);
  const [formToDate, setFormToDate] = useState<Date | null>(sliceToDate !== null ? new Date(sliceToDate) : null); 

  //////////////
  // HANDLERS //
  //////////////
  const setFromDateHandler = (e: Date | null) => {
    const from = e !== null ? e.valueOf() : null;
    const to = formToDate !== null ? formToDate.valueOf() : null;

    submitDates(from, to);
  };

  const setToDateHandler = (e: Date | null) => {
    const from = formFromDate !== null ? formFromDate.valueOf() : null;
    const to = e !== null ? e.valueOf() : null;

    submitDates(from, to);
  };

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////
  const submitDates = (from: number | null, to: number | null) => {
    let submit = true;

    submit = submit && (from === null || !Number.isNaN(from));
    submit = submit && (to === null || !Number.isNaN(to));
    submit = submit && !(from !== null && to !== null && from > to);

    if (submit) {
      dispatch(changeTransactionsRangeAction({ fromDate: from, toDate: to }));
    }

    setFormFromDate(from !== null ? new Date(from) : null);
    setFormToDate(to !== null ? new Date(to) : null);
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactionsDateRange}>
      <DateRange 
        fromDate={formFromDate} 
        setFromDate={setFromDateHandler} 
        toDate={formToDate} 
        setToDate={setToDateHandler}
        variant={variant}
      />
    </div>
  );
};

export default TransactionsDateRange;
