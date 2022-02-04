import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import { TransactionCategory, TransactionKind, ApiError, SvgIcons, GroupTransaction, UserGroup } from 'types/types';
import apiErrors from 'api/apiErrors';
import { deleteTransaction } from 'store/slices/transactions';
import SVG from 'components/ui/svg/SVG';
import AddGroupTransaction from 'components/groups/selectedGroup/addGroupTransaction/AddGroupTransaction';

import { useMediaQuery, useTheme } from '@mui/material';
import Confirmation from 'components/ui/confirmation/Confirmation';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import style from './AddGroupTransactionModal.module.scss';
import { createGroupTransaction } from 'store/slices/groupTransactions';

type AddGroupTransactionModalProps = {
  groupTransactionToUpdate: GroupTransaction | null,
  userGroup: UserGroup,
  open: boolean,
  onClose: () => void,
  setSnackbarText: (arg0: string) => void
}

const AddGroupTransactionModal = ({ groupTransactionToUpdate, userGroup, open, onClose, setSnackbarText }: AddGroupTransactionModalProps): JSX.Element => {
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
  const emptyGroupTransactionToUpdate: GroupTransaction = { id: -1, name: '', kind: TransactionKind.Expense, category: TransactionCategory.Shopping, amount: -1, date: new Date().getTime(), groupId: -1 };
  const isEdit: boolean = groupTransactionToUpdate != null;

  const [groupTransaction, setGroupTransaction] = useState<GroupTransaction>(groupTransactionToUpdate !== null ? groupTransactionToUpdate : emptyGroupTransactionToUpdate);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!groupTransaction.name || groupTransaction.name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!groupTransaction.amount || groupTransaction.amount <= 0) {
      errors.amount = 'The amount must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const removeTransaction = async () => {
    try {
      await dispatch(deleteTransaction({ transactionId: groupTransaction.id }));
      onClose();
      setSnackbarText('Transaction deleted successfully');
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

  const buttonDisabled = (): boolean => {
    let res = false;
    res = res || !groupTransaction.name;
    res = res || groupTransaction.amount.toString() === '';
    res = res || groupTransaction.amount <= 0;
    res = res || groupTransaction.date < (new Date(1970, 0, 2).getTime());
    res = res || Number.isNaN(groupTransaction.date);
    return res;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async () => {
    setServerError('');

    if (validateForm()) {
      try {
        groupTransaction.groupId = userGroup.group.id;
        if (groupTransaction.id < 0) {
          dispatch(createGroupTransaction({ groupTransaction, users: userGroup.users }));
          //await dispatch(createTransaction(transaction)).unwrap();
        } else {
          //await dispatch(updateTransaction(transaction)).unwrap();
        }
        
        onClose();
        setSnackbarText('Group Transaction saved successfully');
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    removeTransaction();
  };

  /////////
  // JSX //
  /////////
  return (
    <Dialog open={open} fullScreen={isPhone} onClose={onClose}>
      <div className={style.addGroupTransactionModal}>

        <DialogTitle>
          {isEdit ? 'Edit' : 'Add'} Transaction
        </DialogTitle>

        <DialogContent dividers>
          <AddGroupTransaction groupTransaction={groupTransaction} setGroupTransaction={setGroupTransaction} formErrors={formErrors} serverError={serverError} />
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
            disabled={buttonDisabled()}
            startIcon={<SVG name={isEdit ? SvgIcons.Edit : SvgIcons.Add} className={style.buttonIcon} />}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>

        </DialogActions>
        
        <Confirmation
          text="Are you sure you want to delete the transaction?"
          buttonCancel="Cancel" 
          buttonOk="Delete" 
          open={deleteConfirmationOpened} 
          onCancel={() => setDeleteConfirmationOpened(false)} 
          onOk={confirmDeleteHandler} 
        />
      
      </div>
    </Dialog>
  );
};

export default AddGroupTransactionModal;
