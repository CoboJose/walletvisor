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
    variant: 'standard' | 'filled' | 'outlined' | undefined,
  }

const DateRange = ({ fromDate, setFromDate, toDate, setToDate, variant }: DateRangeProps): JSX.Element => {
  logger.rendering();
    
  return (
    <div>
      <DatePicker
        label="From"
        value={fromDate}
        minDate={new Date(1970, 0, 2)}
        maxDate={toDate}
        onChange={(e) => setFromDate(e)}
        clearable
        renderInput={(params) => (
          <TextField
            {...params}
            margin="none"
            variant={variant}
            fullWidth
          />
        )}
      />

      <DatePicker
        label="To"
        value={toDate}
        minDate={fromDate !== null ? fromDate : new Date(1970, 0, 2)}
        onChange={(e) => setToDate(e)}
        clearable
        renderInput={(params) => (
          <TextField
            {...params}
            margin="none"
            variant={variant}
            fullWidth
            style={{ marginTop: '10px' }}
          />
        )}
      />
    </div>
  );
};

export default DateRange;
