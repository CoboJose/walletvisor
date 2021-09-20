import React, { useState } from 'react';
//import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import categories from 'utils/transactionCategories';
import { Transaction, TransactionCategory, TransactionKind } from 'types/types';

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
  //const dispatch = useAppDispatch();

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
    if (!amount || amount < 0) {
      errors.amount = 'The amount must be a positive number';
    }
    /*if (!category || !categories.some((c) => c.key === category)) {
      valid = false;
      //errors.category = 'Must be a valid category';
    }*/
    /*if (!date || isNaN(new Date(date).getTime())) {
      valid = false;
      //errors.date = 'Must be a valid Date';
    }*/

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (validateForm()) {
      const transaction: Transaction = { id: -1, name, kind, category, amount, date: 1, userId: -1 };
      console.log(transaction);

      /*const timestamp = helpers.stringDatetoTimeStamp(date);
      const transaction = { title, amount: helpers.round(amount, 2), category, type, date: timestamp };
      onSubmit(transaction);
      try {
        const loginResponse = await api.login(email, password);
        dispatch(login({ loginResponse, keepLoggedIn: rememberPassword }));
        history.push('/home');
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }*/
    }
  };

  //Managing the categories in case none is selected
  /*const setTypeHandler = (newType) => {
    setType(newType);
    newType === 'expense' ? setCategory('food') : setCategory('salary');
  };*/

  /**const errorMSG = (field) => {
    if (errors[field]) {
      return (<div className="err-msg">{errors[field]}</div>);
    }
  };*/

  console.log(kind);

  return (
    <div>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form className={style.transactionForm} onSubmit={submitHandler}>
        
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
          <RadioGroup name="kind" value={kind} onChange={(e) => setKind(e.target.value as TransactionKind)}>
            <FormControlLabel value={TransactionKind.Income} control={<Radio />} label="Income" />
            <FormControlLabel value={TransactionKind.Expense} control={<Radio />} label="Expense" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            variant="outlined"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          >
            {categories.filter((c) => c.type === kind).map((c) =>
              <MenuItem value={c.key}>{c.name}</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Amount"
          type="number"
          fullWidth
          InputProps={{
            inputProps: {
              type: 'number',
              min: 0,
            },
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
          }}
          value={amount}
          onChange={(e) => setAmount(e.target.value as unknown as number)}
        />

        <TextField
          label="Date"
          type="date"
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
          disabled={name.length < 1}
        >
          Add Transaction
        </Button>

      </form>

    </div>
  );
};

export default TransactionForm;
