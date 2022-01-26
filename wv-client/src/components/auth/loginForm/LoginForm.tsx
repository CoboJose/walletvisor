import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { login } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import apiErrors from 'api/apiErrors';
import { ApiError, SvgIcons } from 'types/types';
import regex from 'utils/regex';
import SVG from 'components/ui/svg/SVG';

import Button from '@mui/material/Button/Button';
import TextField from '@mui/material/TextField/TextField';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { Alert } from '@mui/material';

import style from './LoginForm.module.scss';
import { getUser } from 'store/slices/user';

const LoginForm = (): JSX.Element => {
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

    if (validateForm()) {
      try {
        await dispatch(login({ email, password, keepLoggedIn: rememberPassword })).unwrap();
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
    <div className={style.loginForm}>

      <div className={style.titleContainer}>
        <SVG name={SvgIcons.Lock} className={style.lockIcon} />
        <h1 className={style.title}>Log In</h1>
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
          disabled={email.length === 0 || password.length === 0}
        >
          Log In
        </Button>
      </form>

    </div>
  );
};

export default LoginForm;
