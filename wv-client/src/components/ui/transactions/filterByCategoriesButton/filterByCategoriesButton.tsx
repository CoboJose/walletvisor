import React, { useState } from 'react';
import logger from 'utils/logger';

import { Alert, Button, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { SvgIcons } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import TransactionsFilter from 'components/transactions/transactionsFilter/TransactionsFilter';

const FilterByCategoriesButton = (): JSX.Element => {
  logger.rendering();

  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('');

  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  return (
    <div>
      {isPhone ? (
        <>
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
            size="small"
            startIcon={<SVG name={SvgIcons.Settings} style={{ fill: 'currentColor', width: '20px', height: '20px' }} />}
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
            startIcon={<SVG name={SvgIcons.Settings} style={{ fill: 'currentColor', width: '20px', height: '20px' }} />}
          >
            Filter
          </Button>
        </>
      )}

      {isModalOpen && <TransactionsFilter onClose={onCloseModal} />}

      <Snackbar 
        open={snackbarText !== ''} 
        autoHideDuration={2500} 
        onClose={() => setSnackbarText('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setSnackbarText('')} severity="success">
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FilterByCategoriesButton;
