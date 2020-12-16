import React from 'react';
import { useSelector } from 'react-redux';

import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = props => {
  
  if(useSelector(s => s.config.debug.renders)) console.log("RENDERING MODAL");
  
  return (
      <>
        <Backdrop show={props.show} clicked={props.modalClosed} />
        <div
          className='modal'
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
  
  export default Modal;