import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import categories from 'utils/transactionCategories';
import { Transaction, TransactionCategory, TransactionKind, ApiError } from 'types/types';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { add } from 'store/slices/transactions';

import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Alert from '@material-ui/lab/Alert/Alert';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import style from './TransactionForm.module.scss';

const TransactionForm = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [kind, setKind] = useState<TransactionKind>(TransactionKind.Income);
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.Salary);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('2020-01-01');
    
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name || name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!amount || amount < -50) {
      errors.amount = 'The amount must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (validateForm()) {
      const transaction: Transaction = { id: -1, name, kind, category, amount: -58, date: 1, userID: -1 };
      console.log(transaction);
      transaction.date = Date.now();

      /*const timestamp = helpers.stringDatetoTimeStamp(date);
      const transaction = { title, amount: helpers.round(amount, 2), category, type, date: timestamp };
      onSubmit(transaction);
      */
      try {
        const transactionResponse = await api.addTransaction(transaction);
        console.log(transactionResponse);
        dispatch(add({ transaction }));
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

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

  return (
    <div className={style.transactionForm}>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form className={style.form} onSubmit={submitHandler}>
        
        <TextField
          type="text"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Transaction name"
          autoFocus
          value={name} 
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name != null}
          helperText={formErrors.name}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup value={kind} onChange={(e) => setKindHandler(e)} className={style.test}>
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
          {categories.filter((c) => c.type === kind).map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.name}
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
          InputLabelProps={{
            shrink: true,
          }}
          value={date}
          onChange={(e) => setDate(e.target.value as unknown as string)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '10px' }}
          disabled={name.length < 1}
        >
          Add Transaction
        </Button>

      </form>

    </div>
  );
};

export default TransactionForm;
