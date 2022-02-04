import React, { useState } from 'react';
import logger from 'utils/logger';

import { Alert, Button, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { SvgIcons, UserGroup } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import AddGroupTransactionModal from 'components/groups/selectedGroup/addGroupTransaction/AddGroupTransactionModal';

type ButtonAddGroupTransactionProps = {
  userGroup: UserGroup
}
const ButtonAddGroupTransaction = ({ userGroup }: ButtonAddGroupTransactionProps): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('');

  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  return (
    <div>
      {isPhone ? (
        <>
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
            size="small"
            startIcon={<SVG name={SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
          >
            Add
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="text"
            onClick={() => setIsModalOpen(true)}
            size="medium"
            startIcon={<SVG name={SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
          >
            Add Transaction
          </Button>
        </>
      )}

      {isModalOpen && <AddGroupTransactionModal groupTransactionToUpdate={null} open={isModalOpen} onClose={onCloseModal} setSnackbarText={setSnackbarText} userGroup={userGroup} />}

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

export default ButtonAddGroupTransaction;
