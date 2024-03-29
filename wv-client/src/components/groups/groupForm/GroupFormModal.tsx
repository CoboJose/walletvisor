import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import logger from 'utils/logger';
import style from './GroupFormModal.module.scss';
import SVG from 'components/ui/svg/SVG';
import { ApiError, Group, SvgIcons } from 'types/types';
import GroupForm from './GroupForm';
import regex from 'utils/regex';
import { createGroup, deleteGroup, updateGroup } from 'store/slices/groups';
import apiErrors from 'api/apiErrors';
import GroupMembers from '../selectedGroup/groupMembers/GroupMembers';
import Confirmation from 'components/ui/confirmation/Confirmation';

type GroupFormModalProps = {
  setSnackbarText: (arg0: string) => void
  onClose: () => void,
}
const GroupFormModal = ({ setSnackbarText, onClose }: GroupFormModalProps): JSX.Element => {
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
  const groupDtoToUpdate = useAppSelector((state) => state.groups.selectedGroupDto)!;
  
  //Helpers
  const emptyGroup: Group = { id: -1, name: '', color: '#ad1a1a' };
  const isEdit: boolean = groupDtoToUpdate != null;

  const [group, setGroup] = useState<Group>(groupDtoToUpdate !== null ? groupDtoToUpdate.group : emptyGroup);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

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

  const removeGroup = async () => {
    try {
      await dispatch(deleteGroup({ groupId: group.id }));
      setSnackbarText('Group deleted successfully');
      onClose();
    }
    catch (error) {
      const err = error as ApiError;
      setServerError(apiErrors(err.code));
    }
  };

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
          await dispatch(updateGroup(group)).unwrap();
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

  const confirmDeleteHandler = () => {
    setDeleteConfirmationOpened(false);
    removeGroup();
  };

  /////////
  // JSX //
  /////////
  return (
    <Dialog open fullScreen={isPhone} onClose={onClose}>
      <div className={style.groupFormModal}>
        <DialogTitle>
          {isEdit ? 'Edit' : 'Create'} Group
        </DialogTitle>

        <DialogContent dividers>

          <GroupForm group={group} setGroup={setGroup} formErrors={formErrors} serverError={serverError} />
        
          {groupDtoToUpdate != null && (
          <div className={style.members}>
            <GroupMembers />
          </div>
          )}

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

        <Confirmation
          text="Are you sure you want to delete the group? The active created transactions will be deleted from the transactions of the users."
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

export default GroupFormModal;
