import React from 'react';
import logger from 'utils/logger';

import { useMediaQuery, useTheme } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import style from './TransactionsFilter.module.scss';

type TransactionFormModalProps = {
  onClose: () => void
}

const TransactionsFilter = ({ onClose }: TransactionFormModalProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const muiTheme = useTheme();
  const isPhone = useMediaQuery(muiTheme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////

  //////////////
  // HANDLERS //
  //////////////

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactionsDateRange}>
      
      <Dialog open fullScreen={isPhone}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent> 
          hola
        </DialogContent>
        <DialogActions> <Button onClick={onClose} autoFocus> OK </Button> </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionsFilter;
