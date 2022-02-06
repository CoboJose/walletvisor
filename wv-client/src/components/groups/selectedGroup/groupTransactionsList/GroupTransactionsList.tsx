import React, { useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { ApiError, GroupTransactionDTO, SvgIcons } from 'types/types';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';
import { getTransactionCategoryData } from 'utils/transactionCategories';
import dates from 'utils/dates';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Button, Divider, Menu, MenuItem } from '@mui/material';

import style from './GroupTransactionsList.module.scss';
import Confirmation from 'components/ui/confirmation/Confirmation';
import { useDispatch } from 'react-redux';
import math from 'utils/math';
import { deleteGroupTransaction, payGroupTransaction } from 'store/slices/groupTransactions';
import GroupTransactionFormModal from '../GroupTransactionForm/GroupTransactionFormModal';

const GroupTransactionsList = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const dispatch = useDispatch();

  ///////////
  // STATE //
  ///////////
  const groupTrnDTOs = useAppSelector((state) => state.groupTransactions.groupTransactionDTOs);
  const loggedUser = useAppSelector((state) => state.user.user!);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [groupTrnDTOToUpdate, setGroupTrnDTOToUpdate] = useState<GroupTransactionDTO | null>(null);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [contextMenu, setContextMenu] = React.useState<{mouseX: number;mouseY: number; groupTrnId: number;} | null>(null);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
    setGroupTrnDTOToUpdate(null);
  };

  const updateGroupTransactionHandler = (groupTrnDTO: GroupTransactionDTO) => {
    setGroupTrnDTOToUpdate(groupTrnDTO);
    setIsModalOpen(true);
  };

  const handleContextMenuOpen = (event: React.MouseEvent, groupTrnId: number) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null ? (
        {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          groupTrnId
        }) : null,
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const confirmDeleteHandler = () => {
    handleContextMenuClose();
    setDeleteConfirmationOpened(false);
    removeGroupTransaction();
  };

  const cancelDeleteHandler = () => {
    handleContextMenuClose();
    setDeleteConfirmationOpened(false);
  };

  const removeGroupTransaction = async () => {
    try {
      await dispatch(deleteGroupTransaction({ groupTransactionId: contextMenu ? contextMenu.groupTrnId : -1 }));
      setSnackbarText('Group Transaction deleted successfully');
    }
    catch (error) {
      const err = error as ApiError;
      setSnackbarText(err.message);
    }
  };

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////
  const month = (i: number, arr: Array<GroupTransactionDTO>): JSX.Element => {
    let res = null;

    const current = new Date(arr[i].groupTransaction.date);
    const prev = (i > 0) ? new Date(arr[i - 1].groupTransaction.date) : null;
    
    if (i === 0) {
      res = current;
    }

    if (prev !== null && current.getMonth() !== prev.getMonth()) {
      res = current;
    }

    if (res !== null) {
      return (
        <div className={style.listMonth}>
          {res.toLocaleString('en-us', { month: 'long', year: 'numeric' })}
        </div>
      );
    }

    return <Divider />;
  };

  const getPayedListSecondaryAction = (gtDto: GroupTransactionDTO) => {
    const payRemaining = gtDto.userDTOs.reduce((sum, uDTO) => (!uDTO.hasPayed ? ++sum : sum), 0);
    const oweAmount = (gtDto.groupTransaction.amount / gtDto.userDTOs.length) * (payRemaining);
    return (
      gtDto.userDTOs.find((uDTO) => uDTO.user.id === loggedUser.id)!.isCreator ? (
        <div className={style.owned}>
          <span className={style.ownedText}>You are owned</span> <span className={style.ownedAmount}>{math.formatEurNumber(oweAmount)}</span>
        </div>
      ) : (
        <div className={style.owned}>
          <span className={style.ownedText}>You payed</span> <span className={style.ownedAmount}>{math.formatEurNumber(oweAmount)}</span>
        </div>
      )
    );
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupTransactionsList}>

      {groupTrnDTOs.length > 0 
        ? (
          <List className={style.list}>
           
            {groupTrnDTOs.map((gtDto, i, arr) => {
              const groupTrn = gtDto.groupTransaction;
              return (
                <div key={groupTrn.id}>

                  {month(i, arr)}

                  <ListItem
                    button
                    onContextMenu={(e) => handleContextMenuOpen(e, groupTrn.id)}
                    onClick={() => updateGroupTransactionHandler(gtDto)}
                    className={style.listItem}
                  >
            
                    <ListItemIcon>
                      <SVG name={getTransactionCategoryData(groupTrn.category).svg} className={`${style.categorySVG} categoryColor ${groupTrn.category}`} />
                    </ListItemIcon>

                    <ListItemText
                      primary={groupTrn.name}
                      secondary={dates.timestampToStringDate(groupTrn.date)}
                    />

                    <ListItemSecondaryAction>
                      <div>
                        <div className={style.amount}>
                          {math.formatEurNumber(groupTrn.amount)}
                        </div>
                        <div className={style.pay}>
                          {gtDto.userDTOs.find((uDTO) => uDTO.user.id === loggedUser.id)!.hasPayed ? (
                            getPayedListSecondaryAction(gtDto)
                          ) : (
                            <Button 
                              onClick={() => dispatch(payGroupTransaction(groupTrn))}
                              startIcon={<SVG name={SvgIcons.Ok} className={style.payIcon} />}
                              className={style.payButton}
                            >
                              Pay {math.formatEurNumber(groupTrn.amount / gtDto.userDTOs.length)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </ListItemSecondaryAction>

                  </ListItem>

                </div>
              );
            })}
          </List>
        )
        : (
          <div>
            <br />
            <br />
            No Group Transactions to show
            <br />
            <br />
          </div>
        )}

      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={() => setDeleteConfirmationOpened(true)}>
          <SVG name={SvgIcons.Delete} className={style.menuDeleteButtonIcon} />
          Delete
        </MenuItem>
      </Menu>

      <Confirmation 
        text="Are you sure you want to delete the Group Transaction? The created transactions will also be deleted"
        buttonCancel="Cancel" 
        buttonOk="Delete" 
        open={deleteConfirmationOpened} 
        onCancel={cancelDeleteHandler} 
        onOk={confirmDeleteHandler} 
      />

      {isModalOpen && <GroupTransactionFormModal groupTransactionToUpdate={groupTrnDTOToUpdate!.groupTransaction} open={isModalOpen} onClose={onCloseModal} setSnackbarText={setSnackbarText} groupTransactionUsers={groupTrnDTOToUpdate!.userDTOs} />}

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

export default GroupTransactionsList;
