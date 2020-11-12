import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/actions/actionsIndex';
import './Tracker.css'
import Balance from './Balance/Balance'
import AddTransaction from './AddTransaction/AddTransaction'
import Transactions from './Transactions/Transactions';

const tracker = () => {
    
    if(useSelector(state => state.tracker.debug.recharging) === true){
        console.log("RECHARGING TRACKER");
    }

    //Getting the transactions from the database
    //UseEffect => In this case, execute it only when the component(AddTransaction.js) has completed rendering ([])
    const dispatch = useDispatch();
    const token = useSelector(s => s.auth.token);
    const userId = useSelector(s => s.auth.userId);
    useEffect(() => {
        dispatch(actions.getTransactions(token, userId));
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