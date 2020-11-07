import React from 'react'
import { useSelector } from 'react-redux';

import './Balance.css'

const balance = () => {
    
    console.log("RECHARGING BALANCE")

    //State
    const transactions = useSelector(state => state.tracker.transactions)
    
    let balance = 0;
    transactions.map(t => (balance = balance + (t.type==='expense' ? -t.amount : t.amount)));

    return(
        <div className="Balance">
            <p>Balance: {balance}€</p>
        </div>
    )
}

export default balance