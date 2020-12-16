import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import './Transactions.css'
import {fetchTransactions} from '../../../store/slices/tracker'
import Transaction from './Transaction/Transaction'

const transactions = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTIONS");

    //State
    const transactions = useSelector(state => state.tracker.transactions) //Get the data from redux store
    
    const loading = useSelector(state => state.tracker.loading);
    const error = useSelector(state => state.tracker.error);
    //Getting the transactions from the database
    //UseEffect => In this case, execute it only when the component(AddTransaction.js) has completed rendering ([])
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTransactions())
    }, []);

    return(
        <div className='trk-trn-list'>
            
            <div className='title'>
                Transactions {loading && <span className='spinner'></span>}
            </div>
            

            {error && <div className='error-msg'>{error}</div>}
            
            <div className='list'>
                {transactions.map(t => (
                    <Transaction key={t.id} t={t}/>
                ))}
            </div>

        </div>
    );
}

export default transactions;

