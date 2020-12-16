import React from 'react';
import { useSelector } from 'react-redux';

import './Balance.css';
import helpers from '../../../utils/helpers';

const Balance = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING BALANCE");
    const [balance, incomes, expenses] = calculate(useSelector(state => state.tracker.transactions));
    
    return(
        <div className='trk-bal'>
            
            <div className='balance'>
                <span className='title'>Balance</span>
                <span className='amount'>{balance} €</span>
            </div>
            
            <div className='incomes'>
                <span className='title'>Incomes</span> 
                <span className='amount'>{incomes} €</span>
            </div>

            <div className='expenses'>
                <span className='title'>Expenses</span> 
                <span className='amount'>{expenses} €</span>
            </div>

        </div>
    )
}

export default Balance;

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