import React, { useState } from 'react';
import { useDispatch} from 'react-redux';

import './AddTransaction.css';
import * as actions from '../../../store/actions/actionsIndex';
import Categories from '../Utils/Categories/Categories';

const addTransaction = () => {

    console.log("RECHARGING ADD_TRANSACTION")

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

    //Categories:
    const categories = type==='expense' ? Categories.expense : Categories.income;
    

    return (
        <div className="AddTransaction">

            <div className="AddTransactionForm">
                <form onSubmit={addTransactionHandler}>

                    <label htmlFor="text">Text</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title if you wish" />

                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="Enter amount..." required/>

                    <label htmlFor="type">Type </label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <label htmlFor="category">Category </label>
                    <select onChange={e => setCategory(e.target.value)}>
                        {Object.entries(categories).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>

                    <button type="submit">Add transaction</button>
                </form>
            </div>

        </div>
    );
}

export default addTransaction;

/*
let categories = []
    if(type === "expense"){
        categories = ["food", "shopping", "transport", "bills", "other"];
    }else{
        categories = ["salary", "business", "gifts", "other"];
    }

<label htmlFor="category">Category </label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(c => (<option key={c} value={c}>{c}</option>))}
                    </select>
*/