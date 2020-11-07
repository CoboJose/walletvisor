import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as actions from '../../../../store/actions/actionsIndex';
import './Transaction.css';
import Modal from '../../../UI/Modal/Modal';
import TransactionExpanded from './TransactionExpanded'

const transaction = (props) => {

    console.log("RECHARGING TRANSACTION");
    //STATE
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)

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
                <button onClick={() => dispatch(actions.deleteTransaction(props.t.title))}>Delete</button>
            </div>
        </>
    );

}

export default transaction;