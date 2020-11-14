import React from 'react';
import { useSelector } from 'react-redux';

import classes from './Spinner.module.css';

const spinner = () => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING SPINNER");

    return(<div className={classes.Loader}>Loading...</div>);
};

export default spinner;