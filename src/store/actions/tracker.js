//import { createAction } from '@reduxjs/toolkit'
import * as actionTypes from './actionTypes';

export const addTransaction = (title, amount, category, type, date) => {
    return {
        type: actionTypes.ADD_TRANSACTION,
        
        transaction: {
            id: new Date().getTime(),
            title: title,
            amount: amount,
            category: category, 
            type: type,
            date: date,
        }
    }
}

export const updateTransaction = (id, title, amount, category, type, date) => {
    return {
        type: actionTypes.UPDATE_TRANSACTION,

        transaction: {
            id: id,
            title: title,
            amount: amount,
            category: category, 
            type: type,
            date: date,
        }
    }
}

export const deleteTransaction = (id) => {
    return {
        type: actionTypes.DELETE_TRANSACTION,
        id: id,
    }
}