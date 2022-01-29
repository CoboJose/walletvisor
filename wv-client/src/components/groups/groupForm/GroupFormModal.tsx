import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import style from './GroupFormModal.module.scss';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';
import AddGroupForm from './GroupForm';

type GroupFormModalProps = {
  groupToUpdate: string | null,
  onClose: () => void
}
const GroupFormModal = ({ groupToUpdate, onClose }: GroupFormModalProps): JSX.Element => {
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
  
  //Helpers
  const emptyGroup = '';
  const isEdit: boolean = groupToUpdate != null;

  const [group, setGroup] = useState<string>(groupToUpdate !== null ? groupToUpdate : emptyGroup);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    /*if (!transaction.name || transaction.name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!transaction.amount || transaction.amount <= 0) {
      errors.amount = 'The amount must be a positive number';
    }*/

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const removeGroup = async () => {
    /*try {
      await dispatch(deleteTransaction({ transactionId: transaction.id }));
      onClose();
      setSnackbarText('Transaction deleted successfully');
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }*/
  };

  const buttonDisabled = (): boolean => {
    let res = false;

    res = group === 'disabled';

    return res;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async () => {
    setServerError('');

    if (validateForm()) {
      /*try {
        if (transaction.id < 0) {
          await dispatch(createTransaction(transaction)).unwrap();
        } else {
          await dispatch(updateTransaction(transaction)).unwrap();
        }
        
        onClose();
        setSnackbarText('Transaction saved successfully');
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }*/
    }
  };

  const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    removeGroup();
  };

  return (
    <Dialog open fullScreen={isPhone} onClose={onClose}>
      <DialogTitle>
        {isEdit ? 'Edit' : 'Create'} Group
      </DialogTitle>

      <DialogContent dividers>
        <AddGroupForm group={group} setGroup={setGroup} formErrors={formErrors} serverError={serverError} />
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
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupFormModal;
