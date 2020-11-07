import React, { useState } from 'react';
import { useDispatch} from 'react-redux';

import './AddTransaction.css';
import * as actions from '../../../store/actions/actionsIndex';
import Categories from '../Utils/Categories/Categories';

const addTransaction = () => {

    console.log("RECHARGING ADD_TRANSACTION");

    // ######################## State ########################
    // Local State
    const [title, setTitle] = useState(''); // The initial state
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [type, setType] = useState('expense');
    // Redux State
    const dispatch = useDispatch(); //This allows to dispatch actions to redux.

    //How we handle the form
    const addTransactionHandler = event => {
        
        event.preventDefault(); // Don`t recharge the page as it would do with a normal form
        const newAmount = parseFloat(amount.toFixed(2));

        dispatch(actions.addTransaction(title, newAmount, category, type));
    }

    //Managing the categories in case none is selected
    const setTypeHandler = (newType) => {
        setType(newType)
        newType==='expense' ? setCategory('food') : setCategory('salary')
    }

    return (
        <div className="AddTransaction">

            <div className="AddTransactionForm">
                <form onSubmit={addTransactionHandler}>

                    <label htmlFor="text">Text</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title if you wish" />

                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="Enter amount..." required/>

                    <label htmlFor="type">Type </label>
                    <select value={type} onChange={e => setTypeHandler(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <label htmlFor="category">Category </label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        {Categories.filter(c => c.type===type).map(c => 
                            (<option key={c.key} value={c.key}>{c.name}</option>)
                        )}
                    </select>

                    <button type="submit">Add transaction</button>
                </form>
            </div>

        </div>
    );
}

export default addTransaction;