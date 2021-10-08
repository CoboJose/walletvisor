import React from 'react';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { Transaction } from 'types/types';
import logger from 'utils/logger';
import SVG from 'components/ui/svg/SVG';
import { deleteTransaction } from 'store/slices/transactions';
import { getTransactionCategoryData } from 'utils/transactionCategories';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';

import style from './TransactionsList.module.scss';

const TransactionsList = (): JSX.Element => {
  logger.rendering();

  const dispatch = useAppDispatch();

  const transactions: Transaction[] = useAppSelector((state) => state.transactions.transactions);
  
  return (
    <div className={style.transactionsList}>

      <List dense={false} className={style.list}>
        {transactions.map((t, i, arr) => (
          <ListItem key={t.id} divider={i !== arr.length - 1}>
            <ListItemIcon>
              <SVG name={getTransactionCategoryData(t.category).svg} className={`${style.categorySVG} categoryColor ${t.category}`} />
            </ListItemIcon>
            <ListItemText
              primary={t.name}
              secondary={t.amount}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <SVG name="edit" className={style.editSVG} />
              </IconButton>
              <IconButton edge="end" onClick={() => dispatch(deleteTransaction({ transactionId: t.id }))}>
                <SVG name="delete" className={style.deleteSVG} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Fab color="primary" className={style.addTransactionButton}>
        <SVG name="add" className={style.lockIcon} />
      </Fab>
    </div>
  );
};

export default TransactionsList;
