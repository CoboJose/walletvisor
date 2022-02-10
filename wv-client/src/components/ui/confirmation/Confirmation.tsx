import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import logger from 'utils/logger';

type ConfirmationProps = {
  open: boolean
  title?: string | null
  text: string
  buttonCancel?: string | null
  buttonOk: string
  onCancel?: { () : void } | null
  onOk: () => void
}

const Confirmation = ({ title, text, buttonCancel, buttonOk, open, onCancel, onOk }: ConfirmationProps): JSX.Element => {
  logger.rendering();
  
  /////////
  // JSX //
  /////////
  return (
    <Dialog open={open}>
      
      {title !== null ? <DialogTitle>{title}</DialogTitle> : null}

      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>

      <DialogActions>

        {onCancel != null && (
          <Button onClick={onCancel} color="secondary">
            {buttonCancel != null ? buttonCancel : 'Cancel'}
          </Button>
        )}

        <Button onClick={onOk} color="primary" autoFocus>
          {buttonOk}
        </Button>

      </DialogActions>
      
    </Dialog>
  );
};

///////////////////
// DEFAULT PROPS //
///////////////////
Confirmation.defaultProps = {
  title: null,
  onCancel: null,
  buttonCancel: 'Cancel',
};

export default Confirmation;
