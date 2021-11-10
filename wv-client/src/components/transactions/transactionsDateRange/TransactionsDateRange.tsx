import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeTransactionsRangeAction } from 'store/slices/transactions';
import logger from 'utils/logger';
import DateRange from 'components/ui/dateRange/DateRange';
import dates from 'utils/dates';
import style from './TransactionsDateRange.module.scss';
import { Button } from '@mui/material';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';

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
    const from = e !== null ? dates.getTimestampWithoutDate(e) : null;
    const to = formToDate !== null ? dates.getTimestampWithoutDate(formToDate) : null;

    submitDates(from, to);
  };

  const setToDateHandler = (e: Date | null) => {
    const from = formFromDate !== null ? dates.getTimestampWithoutDate(formFromDate) : null;
    const to = e !== null ? dates.getTimestampWithoutDate(e) : null;

    submitDates(from, to);
  };

  const resetDates = () => {
    setFormFromDate(null);
    setFormToDate(null);
    submitDates(null, null);
  };

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////
  const submitDates = (from: number | null, to: number | null) => {
    let submit = true;

    submit = submit && (from === null || (!Number.isNaN(from) && from >= new Date(1970, 0, 2).valueOf()));
    submit = submit && (to === null || (!Number.isNaN(to) && to >= new Date(1970, 0, 2).valueOf()));
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
      
      <div className={style.dateRangeSelector}>
        <DateRange 
          fromDate={formFromDate} 
          setFromDate={setFromDateHandler} 
          toDate={formToDate} 
          setToDate={setToDateHandler}
          variant={variant}
        />
      </div>

      <div className={style.clearButton}>
        <Button 
          startIcon={<SVG name={SvgIcons.Close} className={style.clearIcon} />} 
          onClick={resetDates}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default TransactionsDateRange;
