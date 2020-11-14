import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Backdrop.module.css';

const backdrop = (props) => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING BACKDROP");
    
    return(
        props.show ? <div className={styles.Backdrop} onClick={props.clicked}></div> : null
    );
}

export default backdrop;