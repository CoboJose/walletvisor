import React from 'react';
import { useLocation } from 'react-router-dom';
import Routes from 'routes/Routes';
import logger from 'utils/logger';
import Navbar from 'components/navigation/navbar/Navbar';

const Content: React.FC = () => {
  logger.rendering();

  ///////////
  // REDUX //
  ///////////

  ///////////
  // HOOKS //
  ///////////
  const location = useLocation();

  ///////////
  // STATE //
  ///////////

  ////////////////
  // USE EFFECT //
  ////////////////

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const showNavbar = (): boolean => {
    const excludedLocations = ['/'];
    return !excludedLocations.includes(location.pathname);
  };

  /////////
  // JSX //
  /////////
  return (
    <>
      <Routes />
      {showNavbar() && (
        <>
          <div style={{ marginBottom: '65px' }} />
          <Navbar />
        </>
      )}
    </>
  );
};

export default Content;
