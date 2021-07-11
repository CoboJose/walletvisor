import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';

import * as logger from 'utils/logger';
import FormError from 'components/forms/error/FormError';
import ServerError from 'components/forms/error/ServerError';
import * as api from 'api/api';

import { login } from 'store/slices/auth';

const LoginForm = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // STATE //
  ///////////

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);

  // REDUX //
  const dispatch = useAppDispatch();

  ////////////////
  // USE EFFECT //
  ////////////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (email.length < 10) {
      errors.email = 'email';
    }

    if (password.length < 8) {
      errors.password = 'password';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  //////////////
  // HANDLERS //
  //////////////

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setServerError('');
    
    if (validateForm()) {
      api.login(email, password)
        .then((res) => { console.log(res); dispatch(login('totototoottoken')); })
        .catch((err) => { setServerError(err.code); });
    }
  };

  /////////
  // JSX //
  /////////
  
  return (
    <div>

      { serverError.length > 0 && <ServerError errorCode={serverError} /> }
      
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
