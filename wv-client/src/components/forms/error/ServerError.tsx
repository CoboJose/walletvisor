import React from 'react';

import logger from 'utils/logger';
import apiErrors from 'api/apiErrors';

type ServerErrorProps = {
  errorCode: string
}

const FormError = ({ errorCode }: ServerErrorProps): JSX.Element => {
  logger.rendering();

  return (
    <p>{ apiErrors(errorCode) }</p>
  );
};

export default FormError;
