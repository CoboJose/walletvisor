import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteTransaction, updateTransaction } from '../../../../store/slices/tracker';
import './Transaction.css';
import helpers from '../../../../utils/helpers';
import TransactionForm from '../../shared/TransactionForm';
import categories from '../../../../utils/categories/Categories';

const Transaction = ({t}) => {

    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTION");

    //STATE
    const dispatch = useDispatch();
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    

    const showUpdateFormHandler = () =>{
        setShowDetails(false);
        setShowUpdateForm(true);
    }
    const clickTransactionHandler = () => {
        showUpdateForm ? setShowDetails(false) : setShowDetails(!showDetails);
        setShowUpdateForm(false);
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

    const cat = categories.find(c => c.key==t.category);
    const displayCategory= cat.icon + ' ' + cat.name;

    const transactionDetails = () => (
        <div className='details'>
            <div className='details-elements'>
                <div className='detail-element'><span className='detail-title'>Title:</span> {t.title}</div>
                <div className='detail-element'><span className='detail-title'>Category:</span> {displayCategory}</div>
                <div className='detail-element'><span className='detail-title'>Type:</span> {t.type}</div>
                <div className='detail-element'><span className='detail-title'>Date:</span> {helpers.stringDateFormatted(helpers.timestampToStringDate(t.date))}</div>
            </div>
            <div className='details-btns'>
                <button className='btn-update' onClick={() => showUpdateFormHandler()}>Update</button>
                <button className='btn-delete' onClick={() => dispatch(deleteTransaction({transactionId: t.id}))}>Delete</button>
            </div>
        </div>
    )

    return(
        
        <div className='trk-trn'>

            <div className={"resume" + (showDetails || showUpdateForm ? " expanded" : " contracted")} onClick={clickTransactionHandler}>
                <span className='arrow'>
                    {showDetails || showUpdateForm ? '▼' : '▶'}
                </span>
                <div className='text'>
                    <span className='amount'>{t.amount} €</span>
                    <span className='category'>{displayCategory}</span>
                    <span className='title'>{t.title}</span> 
                </div>
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
export default Transaction;