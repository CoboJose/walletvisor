import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Spinner.module.css';

const spinner = (props) => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING SPINNER");

    return(<div style={props.style} className={styles.spinner}></div>);
};

export default spinner;