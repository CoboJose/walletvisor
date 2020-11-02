import * as actionTypes from './actionTypes';

export const updateBalance = (amount, typee) => {
    return {
        type: actionTypes.UPDATE_BALANCE,
        amount: amount,
        typee: typee
    }
}