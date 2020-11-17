import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import styles from './Transactions.module.css'
import {fetchTransactions} from '../../../store/slices/tracker'
import Transaction from './Transaction/Transaction'

const transactions = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTIONS");

    //State
    const transactions = useSelector(state => state.tracker.transactions) //Get the data from redux store
    
    //Getting the transactions from the database
    //UseEffect => In this case, execute it only when the component(AddTransaction.js) has completed rendering ([])
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTransactions())
    }, []);

    return(
        <div className={styles.Transactions}>
            <p>Transactions:</p>
            {transactions.map(t => (
                <Transaction key={t.id} t={t}/>
            ))}
        </div>
    );
}

export default transactions;

