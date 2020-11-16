import React from 'react'
import { useSelector } from 'react-redux';

import './Balance.css';
import helpers from '../../../utils/helpers'

const balance = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING BALANCE");
    
    const [balance, incomes, expenses] = calculate(useSelector(state => state.tracker.transactions));

    return(
        <div className="Balance">
            <p>Balance: {balance}€</p>

            <p>Incomes: {incomes}€</p>
            <p>Expenses: {expenses}€</p>
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