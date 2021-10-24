import React, { useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { SvgIcons, Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';
import { getTransactionCategoryData } from 'utils/transactionCategories';
import TransactionFormModal from 'components/transactions/transactionForm/TransactionFormModal';
import dates from 'utils/dates';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import style from './TransactionsList.module.scss';

const TransactionsList = (): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////

  ///////////
  // STATE //
  ///////////
  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);
  const [snackbarText, setSnackbarText] = useState<string>('');

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToUpdate(null);
  };

  const updateTransactionHandler = (trn: Transaction) => {
    setTransactionToUpdate(trn);
    setIsModalOpen(true);
  };

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactionsList}>

      {transactions.length > 0 
        ? (
          <List className={style.list}>
           
            {transactions.map((t, i, arr) => (
              
              <ListItem
                key={t.id}
                button
                onClick={() => updateTransactionHandler(t)}
                divider={i !== arr.length - 1}
                className={`${style.listItem} ${t.kind === TransactionKind.Income ? style.income : style.expense}`}
              >
          
                <ListItemIcon>
                  <SVG name={getTransactionCategoryData(t.category).svg} className={`${style.categorySVG} categoryColor ${t.category}`} />
                </ListItemIcon>

                <ListItemText
                  primary={t.name}
                  secondary={dates.timestampToStringDate(t.date)}
                />

                <ListItemSecondaryAction>
                  <div className={`${style.amount} ${t.kind === TransactionKind.Income ? style.income : style.expense}`}>
                    {t.kind === TransactionKind.Income ? <SVG name={SvgIcons.Add} className={style.plusIcon} /> : <SVG name={SvgIcons.Line} className={style.lessIcon} />}
                    {t.amount} €
                  </div>
                </ListItemSecondaryAction>

              </ListItem>
            ))}
          </List>
        )
        : (
          <div>
            <br />
            <br />
            No transactions to show
            <br />
            <br />
          </div>
        )}
      
      <Fab color="primary" className={style.addTransactionButton} onClick={() => setIsModalOpen(true)}>
        <SVG name={SvgIcons.Add} className={style.addIcon} />
      </Fab>

      {isModalOpen && <TransactionFormModal transactionToUpdate={transactionToUpdate} onClose={onCloseModal} setSnackbarText={setSnackbarText} />}

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

export default TransactionsList;
