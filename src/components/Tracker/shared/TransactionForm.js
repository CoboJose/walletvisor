import React, { useState } from 'react';
import { useSelector} from 'react-redux';

import categories from '../../../utils/categories/Categories';
import helpers from '../../../utils/helpers';
import './TransactionForm.css';

const TransactionForm = ({onSubmit, onCancel, t}) => {
    //If a transaction(t) is present, it is an update, else it is a creation.
    if(useSelector(s => s.config.debug.renders)) console.log("RENDERING TRANSACTION_FORM");
    
    const [title, setTitle] = useState(t ? t.title : ''); // The initial state
    const [amount, setAmount] = useState(t ? t.amount : '');
    const [category, setCategory] = useState(t ? t.category : 'food');
    const [type, setType] = useState(t ? t.type : 'expense');
    const [date, setDate] = useState(t ? helpers.timestampToStringDate(t.date) : helpers.getCurrentStringDate());
    const [errors, setErrors] = useState({});

    
    const validateForm = () => {
        let valid = true;
        let errors = {};
        
        if(typeof title !== 'string'){
            valid = false;
            errors.title = "The title must be a string";
        }
        if(!amount || typeof amount !== 'number' || amount < 0){
            valid = false;
            errors.amount = "It must be a positive number";
        }
        if(!type || !(type === 'income' || type ==='expense')){
            valid = false;
            errors.type = "Must be expense or income";
        }
        if(!category || !categories.some(c => c.key === category)){
            valid = false;
            errors.category = "Must be a valid category";
        }
        if(!date || isNaN(new Date(date).getTime())){
            valid = false;
            errors.date = "Must be a valid Date";
        }
        setErrors(errors);

        return valid;
    }

    const submitTransactionHandler = event => {
        event.preventDefault(); // Don`t recharge the page as it would do with a normal form 
        
        if(validateForm()){
            const timestamp = helpers.stringDatetoTimeStamp(date);
            const transaction = {title, amount: helpers.round(amount,2), category, type, date: timestamp};
            onSubmit(transaction);
        }
    }
    //Managing the categories in case none is selected
    const setTypeHandler = (newType) => {
        setType(newType);
        newType==='expense' ? setCategory('food') : setCategory('salary');
    }

    const errorMSG = (field) => {
        if(errors[field]){
            return(<div className={'err-msg'}>{errors[field]}</div>);
        }
    }

    return (
        <form className={'trk-trn-form' + (t ? ' trk-updt-trn' : '')} onSubmit={submitTransactionHandler}>
            
            <div className='left'>
                <div className='input-field'>
                    <label>Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title if you wish" />
                </div>
                {errorMSG("title")}

                <div className='input-field'>
                    <label htmlFor="category">Category</label>
                    <select value={category} required onChange={e => setCategory(e.target.value)}>
                        {categories.filter(c => c.type===type).map(c => 
                            (<option key={c.key} value={c.key}>{c.icon + ' ' + c.name}</option>)
                        )}
                    </select>
                </div>
                {errorMSG("category")}
                
                <div className='input-field'>
                    <label htmlFor="date">Date</label>
                    <input type='date' required value={date} onChange={e => setDate(e.target.value)}></input>
                </div>
                {errorMSG("date")}
            </div>

            <div className='right'>
                <div className='input-field amount'>
                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={amount} min="0" max="99999999999" step='any' required onChange={e => e.target.value >= 0 ? setAmount(parseFloat(e.target.value)) : null} placeholder="Enter amount..."/>
                </div>
                {errorMSG("amount")}
                
                <div className='input-field type'>
                    <label htmlFor="type">Type</label>
                    <select value={type} required onChange={e => setTypeHandler(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                {errorMSG("type")}
                
                <div className='buttons'>
                <button className='btn-submit' type="submit">{t ? 'Update Transaction' : 'Add Transaction'}</button>
                {t && <button className='btn-cancel' onClick={onCancel}>Cancel</button>}
                </div>
            </div>

        </form>
    );
}

export default TransactionForm;