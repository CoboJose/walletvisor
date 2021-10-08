import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';
import { Transaction, TransactionCategory, TransactionKind } from 'types/types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TransactionForm from './TransactionForm';

import style from './TransactionFormModal.module.scss';

type TransactionFormModalProps = {
  transactionToUpdate: Transaction | null,
}

const TransactionFormModal = ({ transactionToUpdate }: TransactionFormModalProps): JSX.Element => {
  logger.rendering();

  const getTransaction = (): Transaction => {
    console.log('here');
    const emptyTransaction: Transaction = { id: -1, name: '', kind: TransactionKind.Income, category: TransactionCategory.Salary, amount: 0, date: 0, userID: -1 };
    return transactionToUpdate !== null ? transactionToUpdate : emptyTransaction;
  };
  
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>(getTransaction());

  return (
    <div>
      <Dialog open={false}>
        <DialogTitle>{isEdit ? 'Edit' : 'Add'} Transaction</DialogTitle>
        <DialogContent dividers>
          <TransactionForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => console.log('a')} className={style.cancelButton} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => console.log('b')} className={style.okButton} color="primary">
            {isEdit ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionFormModal;
