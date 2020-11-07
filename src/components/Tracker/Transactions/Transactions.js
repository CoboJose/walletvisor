import React from 'react'
import { useSelector } from 'react-redux';

import styles from './Transactions.module.css'
import './Transaction/Transaction'
import Transaction from './Transaction/Transaction';

const transactions = () => {
    
    //DEBUG
    if(useSelector(state => state.tracker.debug.recharging) === true){
        console.log("RECHARGING TRANSACTIONS")
    }

    //State
    const transactions = useSelector(state => state.tracker.transactions) //Get the data from redux store

    return(
        <div className={styles.Transactions}>
            <p>Transactions:</p>
            {transactions.map(t => (
                <Transaction key = {t.id} t = {t}/>
            ))}
        </div>
    );
}

export default transactions;