import React, { ChangeEvent } from 'react';
import logger from 'utils/logger';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import style from './TransactionsFilter.module.scss';
import { TextField, MenuItem, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons, TransactionKind } from 'types/types';
import { transactionCategoriesData } from 'utils/transactionCategories';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setFilterCategory, setFilterKind } from 'store/slices/transactions';

type TransactionFormModalProps = {
  open: boolean,
  onClose: () => void
}

const TransactionsFilter = ({ open, onClose }: TransactionFormModalProps): JSX.Element => {
  logger.rendering();
  
  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();

  ///////////
  // STATE //
  ///////////
  const kind = useAppSelector((state) => state.transactions.filterKind);
  const category = useAppSelector((state) => state.transactions.filterCategory);

  //////////////
  // HANDLERS //
  //////////////
  const setKindHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterKind(e.target.value));
  };

  const setCategoryHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterCategory(e.target.value));
  };

  /////////////////////
  // HELPER FUNCTIONS//
  /////////////////////

  /////////
  // JSX //
  /////////
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={style.transactionFilter}>

        <DialogTitle>Filter</DialogTitle>

        <DialogContent> 

          <FormControl component="fieldset">
            <FormLabel component="legend">Kind</FormLabel>
            <RadioGroup 
              row
              value={kind} 
              onChange={(e) => setKindHandler(e)}
              className={style.radios}
            >
              <FormControlLabel value="" control={<Radio />} label="All" />
              <FormControlLabel value={TransactionKind.Income} control={<Radio />} label="Income" />
              <FormControlLabel value={TransactionKind.Expense} control={<Radio />} label="Expense" />
            </RadioGroup>
          </FormControl>
          
          <TextField
            select
            label="Category"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={category}
            disabled={kind === ''}
            onChange={setCategoryHandler}
          >
            <MenuItem value="">
              <SVG name={SvgIcons.ThreeLines} className={style.selectSVG} /> Every
            </MenuItem>
            {transactionCategoriesData.filter((c) => c.type === kind).map((option) => (
              <MenuItem key={option.key} value={option.key}>
                <SVG name={option.svg} className={`${style.selectSVG} categoryColor ${option.key}`} /> {option.name}
              </MenuItem>
            ))}
          </TextField>

        </DialogContent>

        <DialogActions> <Button onClick={onClose} autoFocus> OK </Button> </DialogActions>

      </div>
    </Dialog>
  );
};

export default TransactionsFilter;
