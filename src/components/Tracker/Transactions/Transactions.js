import React from 'react'
import { useSelector } from 'react-redux';

import './Transactions.css'

const transactions = () => {
    
    console.log("RECHARGING TRANSACTIONS")

    //State
    const transactions = useSelector(state => state.tracker.transactions) //Get the data from redux store

    return(
        <div className="Transactions">
            <p>Transactions:</p>
            {transactions.map((t, index) => (
                <div key={index} className="transaction">
                    {t.title}, {t.amount}€<br/>
                    {t.category},{t.type}
                </div>
            ))}
        </div>
    )
}

export default transactions