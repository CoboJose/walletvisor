import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { login } from 'store/slices/auth';
import { useHistory } from 'react-router-dom';
import FormError from 'components/ui/forms/FormError';
import MessageBox from 'components/ui/MessageBox/MessageBox';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import style from './LoginForm.module.scss';

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

    if (!email || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
      errors.email = 'The email must follow this pattern: example@domain.com';
    }
    if (!password || !(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(password)) {
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
        const loginResponse = await api.login(email, password);
        dispatch(login({ loginResponse, keepLoggedIn: rememberPassword }));
        history.push('/home');
      }
      catch (error) {
        const err: ApiError = error;
        setServerError(apiErrors(err.code));
      }
    }
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.form}>

      { serverError.length > 0 && (
        <div className={style.serverError}>
          <MessageBox type="error" message={serverError} /> 
        </div>
      ) }
      
      <form onSubmit={submitHandler}>

        <div>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
          />
          { formErrors.email && <FormError error={formErrors.email} /> }
        </div>

        <div>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
          { formErrors.password && <FormError error={formErrors.password} /> }
        </div>

        <div>
          <span>Remember Me</span>
          <input type="checkbox" onChange={(e) => setRememberPassword(e.target.checked)} checked={rememberPassword} />
        </div>
        
        <button 
          type="submit"
          disabled={email.length === 0 || password.length === 0}
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default LoginForm;
