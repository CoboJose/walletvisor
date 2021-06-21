import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from 'views/login/Login';
import * as logger from 'utils/logger';

const Routes: React.FC = () => {
  logger.rendering();
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact />
      </Switch>
    </Router>
  );
};

export default Routes;
