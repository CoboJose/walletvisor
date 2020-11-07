import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../../../store/actions/actionsIndex';
import Categories from '../../Utils/Categories/Categories'

const transactionExpanded = (props) => {
    
    if(useSelector(state => state.tracker.debug.recharging) === true){
        console.log("RECHARGING TRANSACTION_EXPANDED");
    }

    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(props.t.title);
    const [amount, setAmount] = useState(props.t.amount);
    const [category, setCategory] = useState(props.t.category);
    const [type, setType] = useState(props.t.type);
    const [date, setDate] = useState(props.t.date);

    const editTransactionHandler = event => {
        
        event.preventDefault(); // Don`t recharge the page as it would do with a normal form
        const newAmount = parseFloat(amount.toFixed(2));

        dispatch(actions.updateTransaction(props.t.id, title, newAmount, category, type));
        setEdit(false)
    }

    const changeTypeHandler = event => {
        const type = event.target.value;
        setType(type);
        type === "expense" ? setCategory("food") : setCategory("salary");
    }
    
    return(
        <div className={null}>
                
                <button onClick={() => setEdit(!edit)}>Edit transaction</button>

                <form onSubmit={editTransactionHandler}>

                    <label htmlFor="text">Text</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={!edit} placeholder="Enter a title if you wish" />

                    <label htmlFor="amount">Amount </label>
                    <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} disabled={!edit} placeholder="Enter amount..." required />

                    <label htmlFor="type">Type </label>
                    <select value={type} onChange={e => changeTypeHandler(e)} disabled={!edit}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    
                    <label htmlFor="category">Category </label>
                    <select value={category} onChange={e => setCategory(e.target.value)} disabled={!edit}>
                        {Categories.filter(c => c.type===type).map(c => 
                            (<option key={c.key} value={c.key}>{c.name}</option>)
                        )}
                    </select>

                    <label htmlFor="date">Date</label>
                    <input type='date' value={date} onChange={e => setDate(e.target.value)} disabled={!edit}></input>

                    <button type="submit">Edit transaction</button>
                </form>
            </div>
    );
}

export default transactionExpanded;


