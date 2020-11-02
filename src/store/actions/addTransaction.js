import * as actionTypes from './actionTypes';

export const updateBalance = (amount, type) => {
    
    const newAmount = type ==='expense' ? -amount : amount;

    return {
        type: actionTypes.UPDATE_BALANCE,
        amount: newAmount,
    }
}