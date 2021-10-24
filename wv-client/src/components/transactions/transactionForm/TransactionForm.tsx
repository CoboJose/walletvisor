import React, { ChangeEvent, useEffect, useState } from 'react';
import logger from 'utils/logger';
import dateUtils from 'utils/dates';
import { transactionCategoriesData } from 'utils/transactionCategories';
import { Transaction, TransactionCategory, TransactionKind } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import mathUtils from 'utils/math';

import TextField from '@material-ui/core/TextField/TextField';
import Alert from '@material-ui/lab/Alert/Alert';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

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
  const [date, setDate] = useState<string>(dateUtils.timestampToStringDate(transaction.date));

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Update the transaction when some input is updated
    const timestamp = dateUtils.stringDatetoTimeStamp(date);
    const roundedAmount = mathUtils.round(amount, 2);
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
          }}
          value={amount}
          onChange={(e) => setAmount(e.target.value as unknown as number)}
          error={formErrors.amount != null}
          helperText={formErrors.amount}
        />

        <TextField
          label="Date"
          type="date"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value as unknown as string)}
        />

      </form>

    </div>
  );
};

export default TransactionForm;