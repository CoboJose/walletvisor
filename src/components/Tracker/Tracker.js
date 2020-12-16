import React from 'react';
import { useSelector } from 'react-redux';

import './Tracker.css';
import Balance from './Balance/Balance';
import AddTransaction from './AddTransaction/AddTransaction';
import Transactions from './Transactions/Transactions';

const Tracker = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRACKER");
    
    return(
        <div className='trk'>
            <div className='balance'>
                <Balance className='balance'/>
            </div>
            <div className='add-trn'>
                <AddTransaction className='add-trn'/>
            </div>
            <div className='trns'>
                <Transactions className='trns'/>
            </div>
        </div>
    );

}

export default Tracker;