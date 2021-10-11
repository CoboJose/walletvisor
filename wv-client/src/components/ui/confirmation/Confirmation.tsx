import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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

Confirmation.defaultProps = {
  title: null,
  onCancel: null,
  buttonCancel: 'Cancel',
};

export default Confirmation;
