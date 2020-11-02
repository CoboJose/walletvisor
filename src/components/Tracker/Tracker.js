import React from 'react'

import './Tracker.css'
import AddTransaction from './AddTransaction/AddTransaction'

const tracker = () =>{

    console.log("RECARGANDO TRACKER")

    return(
        <div className="Tracker">
            This is the Tracker
            <AddTransaction/>
        </div>
    );

}

export default tracker;