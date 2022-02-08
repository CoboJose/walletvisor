import React, { useState } from 'react';
import logger from 'utils/logger';
import style from './UserConfiguration.module.scss';
import { TextField, Button, Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateUser } from 'store/slices/user';
import { ApiError, UpdateUserPayload } from 'types/types';
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

  ///////////
  // STATE //
  ///////////
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [name, setName] = useState<string>(user ? user.name : '');
  const [email, setEmail] = useState<string>(user ? user.email : '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////s
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email || !regex.email.test(email)) {
      errors.email = 'The email must follow this pattern: example@domain.com';
    }
    if (newPassword && !regex.password.test(newPassword)) {
      errors.newPassword = 'The password must have: lowercase, uppercase, special character, and more than 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updateUserPayload: UpdateUserPayload = { name, email, newPassword, oldPassword: password };

    if (validateForm()) {
      try {
        await dispatch(updateUser(updateUserPayload)).unwrap();
        setServerError('');
        setNewPassword('');
        setPassword('');
        setSnackbarOpen(true);
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
    <div className={style.userConfiguration}>
      
      <div className={style.userConfigurationForm}>
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
            helperText={formErrors.newPassword != null ? formErrors.newPassword : 'Leave empty if you do not want to change your password'}
            inputProps={{
              autoComplete: 'new-password',
              form: {
                autoComplete: 'off',
              },
            }}
          />

          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Current Password"
            type="password"
            autoComplete="off"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password != null}
            helperText={formErrors.password != null ? formErrors.password : 'Write your current password to save the changes'}
            inputProps={{
              autoComplete: 'new-password',
              form: {
                autoComplete: 'off',
              },
            }}
          />

          <Button
            className={style.saveButton}
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

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2500} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          User modified successfully
        </Alert>
      </Snackbar>
      
    </div>
  );
};

export default UserConfiguration;
