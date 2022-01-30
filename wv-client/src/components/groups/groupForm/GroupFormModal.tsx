import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch } from 'store/hooks';
import logger from 'utils/logger';
import style from './GroupFormModal.module.scss';
import SVG from 'components/ui/svg/SVG';
import { ApiError, Group, SvgIcons } from 'types/types';
import AddGroupForm from './GroupForm';
import regex from 'utils/regex';
import { createGroup } from 'store/slices/groups';
import apiErrors from 'api/apiErrors';

type GroupFormModalProps = {
  groupToUpdate: Group | null,
  setSnackbarText: (arg0: string) => void
  onClose: () => void
}
const GroupFormModal = ({ groupToUpdate, setSnackbarText, onClose }: GroupFormModalProps): JSX.Element => {
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
  const emptyGroup: Group = { id: -1, name: '', color: '#ad1a1a' };
  const isEdit: boolean = groupToUpdate != null;

  const [group, setGroup] = useState<Group>(groupToUpdate !== null ? groupToUpdate : emptyGroup);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  //const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!group.name || group.name.length < 1) {
      errors.name = 'The name can not be empty';
    }
    if (!group.color || group.color.length < 1 || !regex.hexColor.test(group.color)) {
      errors.color = 'Must be a valid color';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /*const removeGroup = async () => {
    try {
      await dispatch(deleteTransaction({ transactionId: transaction.id }));
      onClose();
      setSnackbarText('Transaction deleted successfully');
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };*/

  const buttonDisabled = (): boolean => {
    let res = false;

    res = res || !group.name;
    res = res || !group.color;

    return res;
  };

  //////////////
  // HANDLERS //
  //////////////
  const submitHandler = async () => {
    setServerError('');

    if (validateForm()) {
      try {
        if (group.id < 0) {
          await dispatch(createGroup(group)).unwrap();
        } else {
          //await dispatch(updateTransaction(transaction)).unwrap();
          // TODO
          console.log('to do update');
        }
        
        onClose();
        setSnackbarText('Group saved succesfully');
      }
      catch (error) {
        const err = error as ApiError;
        setServerError(apiErrors(err.code));
      }
    }
  };

  /*const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    removeGroup();
  };*/

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
          onClick={() => console.log('setDeleteConfirmationOpened(true)')} 
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
