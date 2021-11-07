import React, { useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { SvgIcons, Transaction, TransactionKind } from 'types/types';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';
import { getTransactionCategoryData } from 'utils/transactionCategories';
import TransactionFormModal from 'components/transactions/transactionForm/TransactionFormModal';
import dates from 'utils/dates';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Divider } from '@mui/material';

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
  const totalBalance: number = useAppSelector((state) => state.transactions.totalBalance);

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

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////
  const month = (i: number, arr: Array<Transaction>): JSX.Element => {
    let res = null;

    const current = new Date(arr[i].date);
    const prev = (i > 0) ? new Date(arr[i - 1].date) : null;
    
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

  const getTransactionsBalance = (): Array<number> => {
    const res = new Array<number>();

    res[0] = totalBalance;
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      res[i + 1] = res[i] - (t.kind === TransactionKind.Income ? t.amount : -t.amount);
    }

    return res;
  };
  const transactionsBalance: Array<number> = getTransactionsBalance();

  /////////
  // JSX //
  /////////
  return (
    <div className={style.transactionsList}>

      {transactions.length > 0 
        ? (
          <List className={style.list}>
           
            {transactions.map((t, i, arr) => (
              <div key={t.id}>

                {month(i, arr)}

                <ListItem
                  button
                  onClick={() => updateTransactionHandler(t)}
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
                    <div>
                      <div className={`${style.amount} ${t.kind === TransactionKind.Income ? style.income : style.expense}`}>
                        {t.kind === TransactionKind.Income ? '+' : '-'} {t.amount}€
                      </div>
                      <div className={style.trnBalance}>{transactionsBalance[i]}€</div>
                    </div>
                  </ListItemSecondaryAction>

                </ListItem>

              </div>
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
