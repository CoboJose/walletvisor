/* eslint-disable no-return-assign */
import React from 'react';
import logger from 'utils/logger';

import DatePicker from '@mui/lab/DatePicker';

import { TextField } from '@mui/material';

type DateRangeProps = {
    fromDate: Date | null,
    setFromDate: (arg0: Date|null) => void,
    toDate : Date | null,
    setToDate: (arg0: Date|null) => void,
  }

const DateRange = ({ fromDate, setFromDate, toDate, setToDate }: DateRangeProps): JSX.Element => {
  logger.rendering();
    
  return (
    <div>

      <DatePicker
        label="From"
        value={fromDate}
        maxDate={toDate}
        onChange={(e) => setFromDate(e)}
        clearable
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            variant="standard"
          />
        )}
      />

      <span> To </span>

      <DatePicker
        label="To"
        value={toDate}
        minDate={fromDate}
        onChange={(e) => setToDate(e)}
        clearable
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            variant="standard"
          />
        )}
      />
    </div>
  );
};

export default DateRange;
