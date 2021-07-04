import React, { useEffect, useState } from 'react';

import * as logger from 'utils/logger';

type AuthFormProps = {
  formHandler: (email: string, password: string) => void
}

const AuthForm = ({ formHandler }: AuthFormProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // STATE //
  ///////////

  const [formErrors, setFormErrors] = useState({});
  //const [serverErrors, setServerErrors] = useState({});

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [rememberPassword, setRememberPassword] = useState(false);

  ////////////////
  // USE EFFECT //
  ////////////////

  useEffect(() => {
    validateForm();
  }, [email, password]);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (email.length < 5) {
      errors.email = 'aa';
    }

    setFormErrors(errors);
  };

  //////////////
  // HANDLERS //
  //////////////

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formHandler(email, password);
  };

  /////////
  // JSX //
  /////////

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

        <button type="submit">{isRegister ? 'Sign Up' : 'Login'}</button>
      </form>
    </div>
  );
};

export default AuthForm;
