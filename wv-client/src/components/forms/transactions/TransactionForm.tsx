import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import dateUtils from 'utils/dates';
import mathUtils from 'utils/math';
import { transactionCategoriesData } from 'utils/transactionCategories';
import { Transaction, TransactionCategory, TransactionKind, ApiError } from 'types/types';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { getTransactions } from 'store/slices/transactions';
import { logout } from 'store/slices/auth';
import { changeTheme } from 'store/slices/config';
import SVG from 'components/ui/svg/SVG';

import Button from '@material-ui/core/Button/Button';
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

const TransactionForm = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [kind, setKind] = useState<TransactionKind>(TransactionKind.Income);
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.Salary);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(dateUtils.getCurrentStringDate());
  
  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name || name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!amount || amount <= 0) {
      errors.amount = 'The amount must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (validateForm()) {
      const timestamp = dateUtils.stringDatetoTimeStamp(date);
      const roundedAmount = mathUtils.round(amount, 2);
      const transaction: Transaction = { id: -1, name, kind, category, amount: roundedAmount, date: timestamp, userID: -1 };

      try {
        await api.addTransaction(transaction);
        dispatch(getTransactions());
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

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
      <br />
      <button type="button" onClick={() => dispatch(logout())}>Log Out</button>
      <button type="button" onClick={() => dispatch(changeTheme())}>Change theme</button>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form onSubmit={submitHandler}>
        
        <TextField
          type="text"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '10px' }}
          disabled={!name || amount.toString() === ''}
        >
          Add Transaction
        </Button>

      </form>

    </div>
  );
};

export default TransactionForm;
