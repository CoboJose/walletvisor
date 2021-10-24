import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import { Transaction, TransactionCategory, TransactionKind, ApiError, SvgIcons } from 'types/types';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { getTransactions } from 'store/slices/transactions';
import SVG from 'components/ui/svg/SVG';
import TransactionForm from 'components/transactions/transactionForm/TransactionForm';

import { useMediaQuery, useTheme } from '@material-ui/core';
import Confirmation from 'components/ui/confirmation/Confirmation';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import style from './TransactionFormModal.module.scss';

type TransactionFormModalProps = {
  transactionToUpdate: Transaction | null,
  onClose: () => void
  setSnackbarText: (arg0: string) => void
}

const TransactionFormModal = ({ transactionToUpdate, onClose, setSnackbarText }: TransactionFormModalProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));
  
  ///////////
  // STATE //
  ///////////
  const emptyTransaction: Transaction = { id: -1, name: '', kind: TransactionKind.Income, category: TransactionCategory.Salary, amount: 0, date: new Date().getTime(), userID: -1 };
  const isEdit: boolean = transactionToUpdate != null;

  const [transaction, setTransaction] = useState<Transaction>(transactionToUpdate !== null ? transactionToUpdate : emptyTransaction);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!transaction.name || transaction.name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!transaction.amount || transaction.amount <= 0) {
      errors.amount = 'The amount must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const deleteTransaction = async () => {
    try {
      await api.deleteTransaction(transaction.id);
      dispatch(getTransactions());
      onClose();
      setSnackbarText('Transaction deleted successfully');
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async () => {
    setServerError('');

    if (validateForm()) {
      try {
        await api.addTransaction(transaction);
        dispatch(getTransactions());
        onClose();
        setSnackbarText('Transaction saved successfully');
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    deleteTransaction();
  };

  /////////
  // JSX //
  /////////
  return (
    <div>
      <Dialog open fullScreen={isPhone}>

        <DialogTitle>
          {isEdit ? 'Edit' : 'Add'} Transaction
        </DialogTitle>

        <DialogContent dividers>
          <TransactionForm transaction={transaction} setTransaction={setTransaction} formErrors={formErrors} serverError={serverError} />
        </DialogContent>

        <DialogActions>

          <Button 
            onClick={onClose}
            className={style.cancelButton}
            startIcon={<SVG name={SvgIcons.Close} className={style.buttonIcon} />}
          >
            Cancel
          </Button>

          {isEdit && (
            <Button 
              onClick={() => setDeleteConfirmationOpened(true)} 
              className={style.deleteButton}
              startIcon={<SVG name={SvgIcons.Delete} className={style.buttonIcon} />}
            >
              Delete
            </Button>
          )}
          
          <Button 
            onClick={submitHandler} 
            className={style.okButton}
            disabled={!transaction.name || transaction.amount.toString() === ''}
            startIcon={<SVG name={SvgIcons.Edit} className={style.buttonIcon} />}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>

        </DialogActions>

      </Dialog>

      <Confirmation 
        text="Are you sure you want to delete the transaction?" 
        buttonCancel="Cancel" 
        buttonOk="Delete" 
        open={deleteConfirmationOpened} 
        onCancel={() => setDeleteConfirmationOpened(false)} 
        onOk={confirmDeleteHandler} 
      />

    </div>
  );
};

export default TransactionFormModal;