import React from 'react'

import './Tracker.css'
import Balance from './Balance/Balance'
import AddTransaction from './AddTransaction/AddTransaction'
import Transactions from './Transactions/Transactions'

const tracker = () => {

    console.log("RECHARGING TRACKER")

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