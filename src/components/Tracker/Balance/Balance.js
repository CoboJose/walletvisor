import React from 'react'
import { useSelector } from 'react-redux';

import './Balance.css'

const balance = () => {
    
    console.log("RECHARGING BALANCE")

    //State
    const balance = useSelector(state => state.tracker.balance) //Get the data from redux store

    return(
        <div className="Balance">
            <p>Balance: {balance}€</p>
        </div>
    )
}

export default balance