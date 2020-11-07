import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => {
  
  if(useSelector(state => state.tracker.debug.recharging) === true){
    console.log("RECHARGING MODAL");
  }
  
  return (
      <>
        <Backdrop show={props.show} clicked={props.modalClosed} />
        <div
          className={styles.Modal}
          style={{
            transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.show ? '1' : '0'
          }}
        >
          {props.children}
        </div>
      </>
    );
  };
  
  export default modal;