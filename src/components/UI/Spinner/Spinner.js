import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Spinner.module.css';

const spinner = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING SPINNER");

    return(<div className={styles.Loader}>Loading...</div>);
};

export default spinner;