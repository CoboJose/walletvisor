import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import './AddTransaction.css'
import * as actions from '../../../store/actions/actionsIndex'

console.log(actions.updateBalance)

const addTransaction = () => {

    console.log("RECARGANDO ADD TRANSACTION")

    const dispatch = useDispatch(); //This allows to dispatch actions to redux.
    const balance = useSelector(state => state.addTransaction.balance)

    //state
    const [title, setTitle] = useState(''); // The initial state
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [type, setType] = useState('expense');
    const [transactions, setTransactions] = useState('')
    //const [balance, setBalance] = useState(0);

    //Categories:
    let categories = []
    if(type === "expense"){
        categories = ["food", "shopping", "transport", "bills", "other"];
    }else{
        categories = ["salary", "business", "gifts", "other"];
    }

    
    //How we handle the form
    const addTransactionHandler = event => {
        event.preventDefault(); // Don`t recharge the page as it would do with a normal form

        const newAmount = parseFloat(amount.toFixed(2))
        
        const newTransaction = {
            title: title,
            amount: newAmount,
            category: category,
            type: type
        }

        setTransactions(newTransaction); 
        dispatch(actions.updateBalance({newAmount, type}))
    }
    
    const changeTypeHandler = event => {
        const type = event.target.value;
        setType(type);
        type === "expense" ? setCategory("food") : setCategory("salary");
    }

    return (
        <div className="AddTransaction">
            
            <p>Balance: {balance}€</p>

            <div className="AddTransactionForm">
                <form onSubmit={addTransactionHandler}>

                    <label htmlFor="text">Text</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title if you wish" />

                    <label htmlFor="amount">Amount </label>
                    <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="Enter amount..." required/>

                    <label htmlFor="type">Type </label>
                    <select value={type} onChange={e => changeTypeHandler(e)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <label htmlFor="category">Category </label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(c => (<option key={c} value={c}>{c}</option>))}
                    </select>

                    <button type="submit">Add transaction</button>
                </form>
            </div>

            <p>Transactions:</p>
            {transactions.title}

        </div>
    );
}

export default addTransaction;
