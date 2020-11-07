//import { createAction } from '@reduxjs/toolkit'
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

export const updateTransaction = (title, amount, category, type) => {
    return {
        type: actionTypes.UPDATE_TRANSACTION,

        transaction: {
            title: title,
            amount: amount,
            category: category, 
            type: type,
        }
    }
}

export const deleteTransaction = (title) => {
    
    return {
        type: actionTypes.DELETE_TRANSACTION,
        title: title,
    }
}