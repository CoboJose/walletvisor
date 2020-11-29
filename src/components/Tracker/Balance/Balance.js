import React from 'react'
import { useSelector } from 'react-redux';

import styles from './Balance.module.css';
import helpers from '../../../utils/helpers'

const balance = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING BALANCE");
    
    const [balance, incomes, expenses] = calculate(useSelector(state => state.tracker.transactions));
    
    return(
        <div className={styles.Balance}>
            <p className='Total'>Balance: {balance}€</p>

            <p className='Incomes'>Incomes: {incomes}€</p>
            <p className='Expenses'>Expenses: {expenses}€</p>
        </div>
    )
}

export default balance;

const calculate = (transactions) => {
    let balance=0, incomes=0, expenses=0, t;
    
    for (t of transactions){
        if(t.type==='expense')
            balance += -t.amount, expenses += t.amount;
        else
            balance += t.amount, incomes += t.amount;
    }
    return [balance,incomes,expenses].map(e => helpers.round(e,2));
}