import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Tracker.module.css'
import Balance from './Balance/Balance';
import AddTransaction from './AddTransaction/AddTransaction';
import Transactions from './Transactions/Transactions';

const Tracker = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRACKER");
    console.log(styles.balance)
    return(
        <div className={styles.tracker}>
            <div className={styles.balance}>
                <Balance className={styles.balance}/>
            </div>
            <div className={styles.addTransaction}>
                <AddTransaction className={styles.addTransaction}/>
            </div>
            <div className={styles.transactions}>
                <Transactions className={styles.transactions}/>
            </div>
        </div>
    );

}

export default Tracker;