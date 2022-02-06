import React, { useEffect } from 'react';
import { Button, Card, useMediaQuery, useTheme } from '@mui/material';
import logger from 'utils/logger';
import style from './SelectedGroup.module.scss';
import ButtonAddGroupTransaction from 'components/navigation/modalButtons/ButtonAddGroupTransaction';
import GroupTransactionsList from './groupTransactionsList/GroupTransactionsList';
import { getGroupTransactions } from 'store/slices/groupTransactions';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import ButtonGroup from 'components/navigation/modalButtons/ButtonGroup';
import { getGroups, setSelectedGroup } from 'store/slices/groups';
import math from 'utils/math';
import SVG from 'components/ui/svg/SVG';
import { SvgIcons } from 'types/types';

const SelectedGroup = (): JSX.Element => {
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
  const groupDto = useAppSelector((state) => state.groups.selectedGroupDto)!;
  const groupTrnDTOs = useAppSelector((state) => state.groupTransactions.groupTransactionDTOs);
  const loggedUser = useAppSelector((state) => state.user.user!);
  
  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    dispatch(getGroupTransactions({ groupId: groupDto.group.id }));
  }, []);

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const getAmounts = (): number[] => {
    let [balance, oweToYou, youOwe] = [0, 0, 0];
  
    for (const gtDto of groupTrnDTOs) {
      const user = gtDto.userDTOs.find((uDTO) => uDTO.user.id === loggedUser.id)!;
      const payRemaining = gtDto.userDTOs.reduce((sum, uDTO) => (!uDTO.hasPayed ? ++sum : sum), 0);
      const oweAmount = (gtDto.groupTransaction.amount / gtDto.userDTOs.length) * (payRemaining);

      if (user.isCreator) {
        balance += oweAmount;
        oweToYou += oweAmount;
      } else {
        balance -= oweAmount;
        youOwe += oweAmount;
      }
    }
  
    return [balance, oweToYou, youOwe].map((e) => math.round(e, 2));
  };

  const [balance, oweToYou, youOwe] = getAmounts();

  return (
    <div className={style.selectedGroup}>

      <Card className={style.card}>

        <div className={style.buttons}>
          {isPhone ? (
            <Button
              variant="outlined"
              onClick={() => [dispatch(setSelectedGroup(null)), dispatch(getGroups())]}
              size="small"
              startIcon={<SVG name={SvgIcons.Back} className={style.icon} />}
            >
              Return
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={() => [dispatch(setSelectedGroup(null)), dispatch(getGroups())]}
              size="medium"
              startIcon={<SVG name={SvgIcons.Back} className={style.icon} />}
            >
              Return
            </Button>
          )}
          <ButtonAddGroupTransaction />
          <ButtonGroup />
        </div>

        <div className={style.info}>
          <div className={style.text}>
            {balance >= 0 ? 'You are owned:' : 'You own:'} 
            <span className={`${style.number} ${balance >= 0 ? style.positive : style.negative}`}>{math.formatEurNumber(balance)}</span>
          </div>
          <div className={style.text}>
            To receive:
            <span className={`${style.number} ${style.positive}`}>{math.formatEurNumber(oweToYou)}</span>
          </div>
          <div className={style.text}>
            To pay:
            <span className={`${style.number} ${style.negative}`}>{math.formatEurNumber(youOwe)}</span>
          </div>
        </div>

      </Card>

      <div className={style.list}>
        <GroupTransactionsList />
      </div>

    </div>
  );
};

export default SelectedGroup;
