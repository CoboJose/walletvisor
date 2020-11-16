import React from 'react';
import { useSelector } from 'react-redux';

import './Tracker.css'
import Balance from './Balance/Balance'
import AddTransaction from './AddTransaction/AddTransaction'
import Transactions from './Transactions/Transactions';

const tracker = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRACKER");
    
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