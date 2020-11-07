import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Backdrop.module.css';

const backdrop = (props) => {
    
    if(useSelector(state => state.tracker.debug.recharging) === true){
        console.log("RECHARGING BACKDROP");
    }
    
    return(
        props.show ? <div className={styles.Backdrop} onClick={props.clicked}></div> : null
    );
}

export default backdrop;