import React from 'react';

import Routes from 'routes/Routes';
import * as logger from 'utils/logger';

const App: React.FC = () => {
  logger.rendering();

  return (
    <Routes />
  );
};

export default App;
