import React from 'react';
import { useSelector, useDispatch} from 'react-redux';

import { addTransaction } from '../../../store/slices/tracker';
import './AddTransaction.css';
import TransactionForm from '../shared/TransactionForm'

const AddTransaction = () => {

    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING ADD_TRANSACTION");
    const dispatch = useDispatch(); //This allows to dispatch actions to redux.

    const addTransactionHandler = (transaction) => {
        dispatch(addTransaction(transaction))
    }

    return (
        <div className="AddTransaction">
            <p>Add a new Transaction</p>
            <TransactionForm onSubmit = {addTransactionHandler}/>
        </div>
    );
}

export default AddTransaction;