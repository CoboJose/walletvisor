import React, { ChangeEvent, useEffect, useState } from 'react';
import logger from 'utils/logger';
import { transactionCategoriesData } from 'utils/transactionCategories';
import { Transaction, TransactionCategory, TransactionKind } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import mathUtils from 'utils/math';
import dates from 'utils/dates';

import TextField from '@mui/material/TextField/TextField';
import { Alert } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from '@mui/lab/DatePicker';

import style from './TransactionForm.module.scss';

type TransactionFormProps = {
  transaction: Transaction,
  setTransaction : (arg0: Transaction) => void,
  formErrors: Record<string, string>,
  serverError: string
}

const TransactionForm = ({ transaction, setTransaction, formErrors, serverError }: TransactionFormProps): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [name, setName] = useState<string>(transaction.name);
  const [kind, setKind] = useState<TransactionKind>(transaction.kind);
  const [category, setCategory] = useState<TransactionCategory>(transaction.category);
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [date, setDate] = useState<Date>(new Date(transaction.date));

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Update the transaction when some input is updated
    const timestamp = date !== null ? dates.getTimestampWithoutDate(date) : 0;
    const roundedAmount = amount ? mathUtils.round(amount, 2) : 0;
    setTransaction({ ...transaction, name, kind, category, amount: roundedAmount, date: timestamp });
  }, [name, kind, category, amount, date]);

  //////////////
  // HANDLERS //
  //////////////
  const setKindHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const newKind = e.target.value as TransactionKind;
    setKind(newKind);
    const newCategory = newKind === TransactionKind.Expense ? TransactionCategory.Food : TransactionCategory.Salary;
    setCategory(newCategory);
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactionForm}>

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

        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup 
            row
            value={kind} 
            onChange={(e) => setKindHandler(e)}
          >
            <FormControlLabel value={TransactionKind.Income} control={<Radio />} label="Income" />
            <FormControlLabel value={TransactionKind.Expense} control={<Radio />} label="Expense" />
          </RadioGroup>
        </FormControl>

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
          {transactionCategoriesData.filter((c) => c.type === kind).map((option) => (
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

export default TransactionForm;
