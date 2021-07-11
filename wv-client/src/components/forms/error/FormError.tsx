import React from 'react';

import * as logger from 'utils/logger';

type FormErrorProps = {
  error: string
}

const FormError = ({ error }: FormErrorProps): JSX.Element => {
  logger.rendering();

  return (
    <p>{error}</p>
  );
};

export default FormError;
