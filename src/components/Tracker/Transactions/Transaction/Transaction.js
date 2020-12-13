import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteTransaction, updateTransaction } from '../../../../store/slices/tracker'
import './Transaction.css';
import helpers from '../../../../utils/helpers';
import TransactionForm from '../../shared/TransactionForm';

const transaction = ({t}) => {

    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTION");

    //STATE
    const dispatch = useDispatch();
    const [showDetails, setShowDetails] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    

    const showUpdateFormHandler = () =>{
        setShowDetails(false);
        setShowUpdateForm(true)
    }
    const clickTransactionHandler = () => {
        showUpdateForm ? setShowDetails(false) : setShowDetails(!showDetails); 
        setShowUpdateForm(false)
    }
    const cancelUpdateHandler = (event) => {
        event.preventDefault();
        setShowUpdateForm(false);
        setShowDetails(true);
    }
    const updateTransactionHandler = (transaction) => {
        setShowUpdateForm(false);
        setShowDetails(true);
        dispatch(updateTransaction({...transaction, id:t.id}));
    }

    const transactionDetails = () => (
        <div className='details'>
            <p>Category: {t.category}</p>
            <p>Title: {t.title}</p>
            <p>Type: {t.type}</p>
            <p>Date: {helpers.stringDateFormatted(helpers.timestampToStringDate(t.date))}</p>
            <button onClick={() => showUpdateFormHandler()}>Update</button>
            <button onClick={() => dispatch(deleteTransaction({transactionId: t.id}))}>Delete</button>
        </div>
    )

    return(
        
        <div className='trk-trn'>

            <div className="resume" onClick={clickTransactionHandler}>
                <span className='arrow'>{showDetails || showUpdateForm ? '▼' : '▶'}</span>
                <div className='text'>{t.category}, {t.amount}€</div>
                <div className={t.type == 'income' ? 'lateral-income': 'lateral-expense'}></div>
            </div>

            {showDetails && transactionDetails()}
            {showUpdateForm && <TransactionForm 
                                    onSubmit = {updateTransactionHandler} 
                                    onCancel = {cancelUpdateHandler}
                                    t = {t}
                                />}
        
        </div>
    );
}
export default transaction;