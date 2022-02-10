/* eslint-disable no-return-assign */
import React, { useState } from 'react';
import logger from 'utils/logger';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TransactionsDateRange from 'components/transactions/transactionsDateRange/TransactionsDateRange';
import { SvgIcons } from 'types/types';
import SVG from 'components/ui/svg/SVG';

const ButtonDateRange = (): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [datesDialogOpen, setDatesDialogOpen] = useState<boolean>(false);
    
  /////////
  // JSX //
  /////////
  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setDatesDialogOpen(true)}
        size="small"
        startIcon={<SVG name={SvgIcons.Calendar} style={{ fill: 'currentColor', width: '20px', height: '20px' }} />}
      >
        Range
      </Button>

      <Dialog open={datesDialogOpen} onClose={() => setDatesDialogOpen(false)}>
        <DialogTitle>Transactions Dates</DialogTitle>
        <DialogContent> 
          <TransactionsDateRange variant="outlined" />
        </DialogContent>
        <DialogActions> <Button onClick={() => setDatesDialogOpen(false)} autoFocus> OK </Button> </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonDateRange;
