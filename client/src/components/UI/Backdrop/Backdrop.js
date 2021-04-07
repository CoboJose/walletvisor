import React from 'react';
import { useSelector } from 'react-redux';

import './Backdrop.css';

const Backdrop = (props) => {
    
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING BACKDROP");
    
    return(
        props.show ? <div className='backdrop' onClick={props.clicked}></div> : null
    );
}

export default Backdrop;