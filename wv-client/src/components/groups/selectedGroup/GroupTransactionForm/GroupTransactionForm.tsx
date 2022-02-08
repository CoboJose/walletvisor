import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';
import { transactionCategoriesData } from 'utils/transactionCategories';
import { GroupTransaction, TransactionCategory } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import mathUtils from 'utils/math';
import dates from 'utils/dates';

import TextField from '@mui/material/TextField/TextField';
import { Alert } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from '@mui/lab/DatePicker';

import style from './GroupTransactionForm.module.scss';

type GroupTransactionFormProps = {
  groupTransaction: GroupTransaction,
  setGroupTransaction : (arg0: GroupTransaction) => void,
  formErrors: Record<string, string>,
  serverError: string
}

const GroupTransactionForm = ({ groupTransaction, setGroupTransaction, formErrors, serverError }: GroupTransactionFormProps): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [name, setName] = useState<string>(groupTransaction.name);
  const [category, setCategory] = useState<TransactionCategory>(groupTransaction.category);
  const [amount, setAmount] = useState<number>(groupTransaction.amount);
  const [date, setDate] = useState<Date>(new Date(groupTransaction.date));

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Update the transaction when some input is updated
    const timestamp = date !== null ? dates.getTimestampWithoutTime(date) : 0;
    const roundedAmount = amount ? mathUtils.round(amount, 2) : 0;
    setGroupTransaction({ ...groupTransaction, name, category, amount: roundedAmount, date: timestamp });
  }, [name, category, amount, date]);

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupTransactionForm}>

      { serverError.length > 0 && (
        <Alert severity="error">{serverError}</Alert>
      ) }

      <form>
        
        <TextField
          type="text"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus={name === ''}
          value={name} 
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name != null}
          helperText={formErrors.name}
        />

        <TextField
          select
          label="Category"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
        >
          {transactionCategoriesData.filter((c) => c.type === groupTransaction.kind).map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <SVG name={option.svg} className={`${style.selectSVG} categoryColor ${option.key}`} /> {option.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Amount"
          type="number"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
            inputProps: { min: -10 }
          }}
          value={amount >= 0 ? amount : ''}
          onChange={(e) => setAmount(e.target.value as unknown as number)}
          error={formErrors.amount != null}
          helperText={formErrors.amount}
        />

        <DatePicker
          label="Date"
          value={date}
          minDate={new Date(1970, 0, 2)}
          onChange={(e) => setDate(e as Date)}
          renderInput={(params) => (
            <TextField 
              fullWidth
              margin="normal"
              required
              {...params} 
            />
          )}
        />

      </form>

    </div>
  );
};

export default GroupTransactionForm;
