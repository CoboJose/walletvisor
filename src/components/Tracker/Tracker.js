import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {fetchTransactions} from '../../store/slices/tracker'
import './Tracker.css'
import Balance from './Balance/Balance'
import AddTransaction from './AddTransaction/AddTransaction'
import Transactions from './Transactions/Transactions';

const tracker = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRACKER");

    //Getting the transactions from the database
    //UseEffect => In this case, execute it only when the component(AddTransaction.js) has completed rendering ([])
    const dispatch = useDispatch();
    const token = useSelector(s => s.auth.token);
    const userId = useSelector(s => s.auth.userId);
    //const userId = useSelector(s => s.auth.userId);
    useEffect(() => {
        dispatch(fetchTransactions({token, userId}))
    }, []);

    return(
        <div className="Tracker">
            This is the Tracker
            <Balance/>
            <AddTransaction/>
            <Transactions/>
        </div>
    );

}

export default tracker;