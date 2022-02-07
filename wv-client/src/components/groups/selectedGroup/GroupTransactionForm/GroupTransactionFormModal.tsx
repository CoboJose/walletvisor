import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import logger from 'utils/logger';
import { TransactionCategory, TransactionKind, ApiError, SvgIcons, GroupTransaction, GroupTransactionUsersDTO } from 'types/types';
import apiErrors from 'api/apiErrors';
import SVG from 'components/ui/svg/SVG';
import GroupTransactionForm from 'components/groups/selectedGroup/GroupTransactionForm/GroupTransactionForm';

import { useMediaQuery, useTheme } from '@mui/material';
import Confirmation from 'components/ui/confirmation/Confirmation';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import style from './GroupTransactionFormModal.module.scss';
import { createGroupTransaction, deleteGroupTransaction, updateGroupTransaction } from 'store/slices/groupTransactions';

type GroupTransactionFormModalProps = {
  groupTransactionToUpdate: GroupTransaction | null,
  open: boolean,
  onClose: () => void,
  setSnackbarText: (arg0: string) => void,
  groupTransactionUsers?: GroupTransactionUsersDTO[] | null
}
const GroupTransactionFormModal = ({ groupTransactionToUpdate, open, onClose, setSnackbarText, groupTransactionUsers }: GroupTransactionFormModalProps): JSX.Element => {
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
  const groupDto = useAppSelector((state) => state.groups.selectedGroupDto)!;

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

  const removeGroupTransaction = async () => {
    try {
      await dispatch(deleteGroupTransaction({ groupTransactionId: groupTransaction.id })).unwrap();
      onClose();
      setSnackbarText('Group Transaction deleted successfully');
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
        groupTransaction.groupId = groupDto.group.id;
        if (groupTransaction.id < 0) {
          const userDTOs: GroupTransactionUsersDTO[] = [];
          groupDto.users.forEach((u) => userDTOs.push({ user: u, isCreator: false, hasPayed: false }));
          await dispatch(createGroupTransaction({ groupTransaction, userDTOs, isActive: false })).unwrap();
          setSnackbarText('Group Transaction created successfully');
        } else {
          await dispatch(updateGroupTransaction(groupTransaction)).unwrap();
          setSnackbarText('Group Transaction saved successfully, and transactions updated');
        }
        
        onClose();
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    removeGroupTransaction();
  };

  /////////
  // JSX //
  /////////
  return (
    <Dialog open={open} fullScreen={isPhone} onClose={onClose}>
      <div className={style.GroupTransactionFormModal}>

        <DialogTitle>
          {isEdit ? 'Edit' : 'Add'} Group Transaction
        </DialogTitle>

        <DialogContent dividers>
          <div>
            
            <GroupTransactionForm groupTransaction={groupTransaction} setGroupTransaction={setGroupTransaction} formErrors={formErrors} serverError={serverError} />
            
            {groupTransactionUsers != null && (
              <div className={style.users}> 
                <p className={style.header}>Users</p>
                <div className={style.list}> 
                  {groupTransactionUsers.map((uDTO) => (
                    <div key={uDTO.user.id} className={style.listItem}>
                      <div className={style.listItemContainer}>{uDTO.user.email}</div>
                      <div className={style.listItemContainer}><span className={style.listName}>Payed: </span> <span>{uDTO.hasPayed ? 'Yes' : 'No'}</span></div>
                      <div className={style.listItemContainer}><span className={style.listName}>Creator: </span> <span>{uDTO.isCreator ? 'Yes' : 'No'}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
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
          text="Are you sure you want to delete the Group Transaction? The created transactions will also be deleted"
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

GroupTransactionFormModal.defaultProps = {
  groupTransactionUsers: null,
};

export default GroupTransactionFormModal;
