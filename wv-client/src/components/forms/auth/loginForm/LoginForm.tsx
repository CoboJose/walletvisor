import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { login } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import regex from 'utils/regex';

import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert/Alert';
import useTheme from '@material-ui/core/styles/useTheme';

import style from './LoginForm.module.scss';

const LoginForm = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const history = useHistory();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  ///////////
  // STATE //
  ///////////
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [email, setEmail] = useState<string>('user1@test.com');
  const [password, setPassword] = useState<string>('c0mplexPa$$');
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////s
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'The email must follow this pattern: example@domain.com';
    }
    if (!password) {
      errors.password = 'Missing Password';
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
        const loginResponse = await api.login(email, password);
        dispatch(login({ loginResponse, keepLoggedIn: rememberPassword }));
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
    <div className={style.loginForm}>

      <div className={style.icon}>
        <LockOutlinedIcon />
      </div>

      <h1>Log in</h1>

      { serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
      ) }

      <form onSubmit={submitHandler} className={style.form}>
        
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

        <FormControlLabel
          control={<Checkbox value="remember" color="primary" onChange={(e) => setRememberPassword(e.target.checked)} />}
          label="Remember me"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={style.submit}
          disabled={email.length === 0 || password.length === 0}
        >
          Log In
        </Button>
      </form>

    </div>
  );
};

export default LoginForm;
