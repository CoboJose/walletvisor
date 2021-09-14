import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { register } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import regex from 'utils/regex';

import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';

import style from './RegisterForm.module.scss';

const RegisterForm = (): JSX.Element => {
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
    <Container component="main" maxWidth="xs">

      { serverError.length > 0 && (
        <Box>
          <Alert severity="error">{serverError}</Alert>
        </Box>
      ) }

      <Box className={style.paper}>
        
        <Avatar className={style.avatar} style={{ backgroundColor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Log in
        </Typography>

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

      </Box>
    </Container>
  );
};

export default RegisterForm;
