import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { register } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import regex from 'utils/regex';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ReactComponent as LockIcon } from 'assets/icons/others/lock.svg';
import Alert from '@material-ui/lab/Alert';

import style from './RegisterForm.module.scss';

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

  const [email, setEmail] = useState<string>('user1@test.com');
  const [password, setPassword] = useState<string>('c0mplexPa$$');

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
        const registerResponse = await api.register(email, password);
        dispatch(register({ registerResponse }));
        history.push('/home');
      }
      catch (error) {
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

      <LockIcon className={style.lockIcon} />

      <h1 className={style.title}>Sign in</h1>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form onSubmit={submitHandler}>
        
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
          autoComplete="current-password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password != null}
          helperText={formErrors.password}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={email.length === 0 || password.length === 0}
        >
          Sign In
        </Button>
      </form>

    </div>
  );
};

export default RegisterForm;