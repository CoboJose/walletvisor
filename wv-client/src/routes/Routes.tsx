import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from 'views/login/Login';
import * as logger from 'utils/logger';

import { useAppSelector } from 'store/hooks';

const Routes: React.FC = () => {
  logger.rendering();

  const count = useAppSelector((state) => state.auth.token);

  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact />
      </Switch>

      <p>Token: {count}</p>
    </Router>
  );
};

export default Routes;
