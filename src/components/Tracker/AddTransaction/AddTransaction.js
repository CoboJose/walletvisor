import React from 'react';
import { useSelector, useDispatch} from 'react-redux';

import { addTransaction } from '../../../store/slices/tracker';
import './AddTransaction.css';
import TransactionForm from '../shared/TransactionForm'

const AddTransaction = () => {
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING ADD_TRANSACTION");
    const dispatch = useDispatch();

    const addTransactionHandler = (transaction) => {
        dispatch(addTransaction(transaction))
    }

    return (
        <div className='trk-addtrn'>
            <div className='title'>New Transaction</div>
            <TransactionForm onSubmit = {addTransactionHandler}/>
        </div>
    );
}

export default AddTransaction;