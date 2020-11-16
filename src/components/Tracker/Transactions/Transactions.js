import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import styles from './Transactions.module.css'
import './Transaction/Transaction'
import {fetchTransactions, deleteTransaction} from '../../../store/slices/tracker'

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

    const transaction = (t) => (
        <div key={t.id} className="Transaction" onClick={() => console.log('Clicked')}>
            {t.title}, {t.amount}€ <br/>
            <button onClick={() => dispatch(deleteTransaction({transactionId: t.id}))}>Delete</button>
        </div>
    );

    return(
        <div className={styles.Transactions}>
            <p>Transactions:</p>
            {transactions.map(t => (
                transaction(t)
            ))}
        </div>
    );
}

export default transactions;

