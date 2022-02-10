import React, { useState } from 'react';
import logger from 'utils/logger';

import { Button } from '@mui/material';
import { SvgIcons } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import TransactionsFilter from 'components/transactions/transactionsFilter/TransactionsFilter';

type ButtonFilterTransactionsProps = {
  isPhone: boolean
}
const ButtonFilterTransactions = ({ isPhone }: ButtonFilterTransactionsProps): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  /////////
  // JSX //
  /////////
  return (
    <div>
      {isPhone ? (
        <>
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
            size="small"
            startIcon={<SVG name={SvgIcons.Filter} style={{ fill: 'currentColor', width: '20px', height: '20px' }} />}
          >
            Filter
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="text"
            onClick={() => setIsModalOpen(true)}
            size="medium"
            startIcon={<SVG name={SvgIcons.Filter} style={{ fill: 'currentColor', width: '20px', height: '20px' }} />}
          >
            Filter
          </Button>
        </>
      )}

      {isModalOpen && <TransactionsFilter open={isModalOpen} onClose={onCloseModal} />}

    </div>
  );
};

export default ButtonFilterTransactions;