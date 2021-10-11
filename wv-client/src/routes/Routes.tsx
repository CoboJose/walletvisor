/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Switch, Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import logger from 'utils/logger';
import Welcome from 'views/login/Welcome';
import Transactions from 'views/transactions/Transactions';

const Routes: React.FC = () => {
  logger.rendering();

  return (
    <Switch>
      <Route path="/" component={Welcome} exact />
      <PrivateRoute path="/home" component={Transactions} />
    </Switch>
  );
};

const PrivateRoute: FC<RouteProps> = ({ component: Component, ...rest }) => {
  const token = useAppSelector((state) => state.auth.token);
  const isLoggedIn = token !== '';

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps<{}>) => isLoggedIn ? (<Component {...props} />) : (<Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};

export default Routes;
