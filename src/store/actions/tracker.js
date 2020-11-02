import * as actionTypes from './actionTypes';

export const addTransaction = (title, amount, category, type) => {
    return {
        type: actionTypes.ADD_TRANSACTION,

        transaction: {
            title: title,
            amount: amount,
            category: category, 
            type: type,
        }
    }
}

export const updateBalance = (amount, type) => {
    const newAmount = type ==='expense' ? -amount : amount;
    return {
        type: actionTypes.UPDATE_BALANCE,
        
        amount: newAmount,
    }
}