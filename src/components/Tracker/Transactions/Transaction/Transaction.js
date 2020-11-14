import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteTransaction } from '../../../../store/slices/tracker'
import './Transaction.css';
import Modal from '../../../UI/Modal/Modal';
import TransactionExpanded from './TransactionExpanded'

const transaction = (props) => {

    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTION");

    //STATE
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(s => s.auth.token);
    const transactionId = props.t.id;
    
    const openTransactionModal = () => {
        setShowModal(true);
    }

    const closeTransactionModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <Modal show={showModal} modalClosed={closeTransactionModal}>
                <TransactionExpanded t={props.t}/>
            </Modal>
            <div className="Transaction" onClick={openTransactionModal}>
                {props.t.title}, {props.t.amount}€<br />
                <button onClick={() => dispatch(deleteTransaction({token, transactionId}))}>Delete</button>
            </div>
        </>
    );

}

export default transaction;

//