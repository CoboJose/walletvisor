import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { register } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import apiErrors from 'api/apiErrors';
import { ApiError, SvgIcons } from 'types/types';
import regex from 'utils/regex';
import SVG from 'components/ui/svg/SVG';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import style from './RegisterForm.module.scss';
import { getUser } from 'store/slices/user';

const RegisterForm = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const history = useHistory();
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////s
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'The email must follow this pattern: example@domain.com';
    }
    if (!password || !regex.password.test(password)) {
      errors.password = 'The password must have: lowercase, uppercase, special character, and more than 8 characters';
    }

    if (!repeatPassword || repeatPassword !== password) {
      errors.repeatPassword = 'The passwords do not match up';
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
      try {
        await dispatch(register({ email, password })).unwrap();
        await dispatch(getUser()).unwrap();
        setServerError('');
        history.push('/transactions');
      } catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.registerForm}>

      <div className={style.titleContainer}>
        <SVG name={SvgIcons.Lock} className={style.lockIcon} />
        <h1 className={style.title}>Sign Up</h1>
      </div>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form onSubmit={(e) => submitHandler(e)}>
        
        <TextField
          type="email"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoComplete="email"
          autoFocus
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email != null}
          helperText={formErrors.email}
          
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password != null}
          helperText={formErrors.password}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="repeatPassword"
          label="Repeat Password"
          type="password"
          id="repatPassword"
          value={repeatPassword} 
          onChange={(e) => setRepeatPassword(e.target.value)}
          error={formErrors.repeatPassword != null}
          helperText={formErrors.repeatPassword}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={email.length === 0 || password.length === 0}
          className={style.signUpButton}
        >
          Sign Up
        </Button>
      </form>

    </div>
  );
};

export default RegisterForm;
