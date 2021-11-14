import React, { useState } from 'react';
import logger from 'utils/logger';
import style from './UserConfiguration.module.scss';
import { TextField, Button, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUser } from 'store/slices/user';
import { ApiError } from 'types/types';
import apiErrors from 'api/apiErrors';
import regex from 'utils/regex';

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

const UserConfiguration = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  console.log(user);

  ///////////
  // STATE //
  ///////////
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [name, setName] = useState<string>(user ? user.name : '');
  const [email, setEmail] = useState<string>(user ? user.email : '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////s
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'The email must follow this pattern: example@domain.com';
    }
    if (!password || !regex.password.test(newPassword)) {
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

    if (validateForm()) {
      try {
        await dispatch(getUser()).unwrap();
        setServerError('');
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
    <div className={style.UserConfiguration}>
      
      <div className={style.loginForm}>
        <h1 className={style.title}>User Configuration</h1>

        {serverError.length > 0 && (
        <div>
          <Alert severity="error">{serverError}</Alert>
        </div>
        )}

        <form onSubmit={submitHandler}>
        
          <TextField
            type="text"
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name != null}
            helperText={formErrors.name}
          />
          
          <TextField
            type="email"
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email != null}
            helperText={formErrors.email}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="New Password"
            type="password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            error={formErrors.newPassword != null}
            helperText={formErrors.newPassword}
          />

          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
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
            disabled={name.length === 0 || email.length === 0 || password.length === 0}
          >
            Save
          </Button>
        </form>

      </div>
    </div>
  );
};

export default UserConfiguration;
