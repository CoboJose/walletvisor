import React, { useState } from 'react';
import logger from 'utils/logger';

import { Alert, Button, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { SvgIcons } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import GroupFormModal from 'components/groups/groupForm/GroupFormModal';
import { useAppSelector } from 'store/hooks';

const ButtonGroup = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////
  const groupDto = useAppSelector((state) => state.groups.selectedGroupDto)!;
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('');

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  /////////
  // JSX //
  /////////
  return (
    <div>
      {isPhone ? (
        <Button
          variant="outlined"
          onClick={() => setIsModalOpen(true)}
          size="small"
          startIcon={<SVG name={groupDto != null ? SvgIcons.Edit : SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          {groupDto != null ? 'Edit' : 'Create'}
        </Button>
      ) : (
        <Button
          variant="text"
          onClick={() => setIsModalOpen(true)}
          size="medium"
          startIcon={<SVG name={groupDto != null ? SvgIcons.Edit : SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          {groupDto != null ? 'Edit' : 'Create'} Group
        </Button>
      )}

      {isModalOpen && <GroupFormModal setSnackbarText={setSnackbarText} onClose={onCloseModal} />}

      <Snackbar 
        open={snackbarText !== ''} 
        autoHideDuration={2500} 
        onClose={() => setSnackbarText('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setSnackbarText('')} severity="success">
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ButtonGroup;
