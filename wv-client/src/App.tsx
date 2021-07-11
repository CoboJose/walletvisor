import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Routes from 'routes/Routes';
import * as logger from 'utils/logger';
import store from 'store/store';

const App: React.FC = () => {
  logger.rendering();

  return (
    <ReduxProvider store={store}>
      <Routes />
    </ReduxProvider>
  );
};

export default App;
