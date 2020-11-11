//import { createAction } from '@reduxjs/toolkit'

import * as actionTypes from './actionTypes';
import axios from '../../axios';


const addTransactionStart = () => {
    return{
        type: actionTypes.ADD_TRANSACTION_START,
    }
}
const addTransactionSuccess = (transaction, id) => {
    return{
        type: actionTypes.ADD_TRANSACTION_SUCCESS,
        transaction: transaction,
        id: id,
    }
}
const addTransactionFail = (error) => {
    return{
        type: actionTypes.ADD_TRANSACTION_FAIL,
        error: error,
    }
}

export const addTransaction = (title, amount, category, type, date, token) => {
    const transaction = {
        title: title,
        amount: amount,
        category: category, 
        type: type,
        date: date,
    }
    return dispatch => {
        
        dispatch(addTransactionStart());
        
        axios.post('/transactions.json?auth='+token, transaction)
        .then(response => {
            dispatch(addTransactionSuccess(transaction, response.data.name));
        })
        .catch(error => {
            dispatch(addTransactionFail(error));
        });
    }
    
}

const getTransactionsStart = () => {
    return{
        type: actionTypes.GET_TRANSACTIONS_START,
    }
}
const getTransactionsSuccess = (transactions) => {
    return{
        type: actionTypes.GET_TRANSACTIONS_SUCCESS,
        transactions: transactions,
    }
}
const getTransactionsFail = (error) => {
    return{
        type: actionTypes.GET_TRANSACTIONS_FAIL,
        error: error,
    }
}

export const getTransactions = (token, userId) => {
    return dispatch => {
        console.log(userId)
        dispatch(getTransactionsStart());
        axios.get('/transactions.json?auth='+token)
            .then( res => {
                const transactions = [];
                for(let id in res.data){
                    transactions.push({...res.data[id], id:id});
                }
                dispatch(getTransactionsSuccess(transactions));
            })
            .catch(error => {
                dispatch(getTransactionsFail(error));
            })
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