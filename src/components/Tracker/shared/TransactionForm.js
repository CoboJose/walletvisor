import React, { useState } from 'react';
import { useSelector} from 'react-redux';

import Categories from '../../../utils/categories/Categories';
import helpers from '../../../utils/helpers';
import styles from './TransactionForm.module.css';

const TransactionForm = ({onSubmit, onCancel, t}) => {
    //If a transaction(t) is present, it is an update, else it is a creation.
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTION_FORM");
    
    const [title, setTitle] = useState(t ? t.title : ''); // The initial state
    const [amount, setAmount] = useState(t ? t.amount : '');
    const [category, setCategory] = useState(t ? t.category : 'food');
    const [type, setType] = useState(t ? t.type : 'expense');
    const [date, setDate] = useState(t ? helpers.timestampToStringDate(t.date) : helpers.getCurrentStringDate());
    const [errors, setErrors] = useState({})
    
    const validateForm = () => {
        let valid = true;
        setErrors({});

        if(!title || title.length < 5){
            valid = valid && false;
            setErrors({...errors, title:"Title Error"});
        }

        return [valid, errors];
    }

    const submitTransactionHandler = event => {
        event.preventDefault(); // Don`t recharge the page as it would do with a normal form 
        
        const timestamp = helpers.stringDatetoTimeStamp(date);
        const transaction = {title, amount: helpers.round(amount,2), category, type, date: timestamp};
        const [valid, errors] = validateForm();
        console.log(valid)
        valid && onSubmit(transaction);
    }
    console.log(errors)
    //Managing the categories in case none is selected
    const setTypeHandler = (newType) => {
        setType(newType)
        newType==='expense' ? setCategory('food') : setCategory('salary')
    }
    
    return (
        <div className={t ? styles.formUpdate : styles.formAdd}>
            <form onSubmit={submitTransactionHandler}>

                <label htmlFor="text">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title if you wish" />
                {errors.title && <p>{errors.title}</p>}

                <label htmlFor="amount">Amount</label>
                <input type="number" value={amount} min="0" onChange={e => setAmount(parseFloat(e.target.value))} placeholder="Enter amount..." required/>

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

                <label htmlFor="date">Date</label>
                <input type='date' value={date} onChange={e => setDate(e.target.value)}></input>

                <button type="submit">{t ? 'Update Transaction' : 'Add Transaction'}</button>
                {t && <button onClick={onCancel}>Cancel</button>}
            </form>
        </div>
    );
}

export default TransactionForm;