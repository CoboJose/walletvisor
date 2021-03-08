import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux'
import Balance from '../../../components/Tracker/Balance/Balance';

configure({adapter: new Adapter()});

describe('Tracker/Balance', () => {
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    
    it('should render 3 <p> always', () => {
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce([])
        wrapper = shallow(<Balance/>)
        
        expect(wrapper.find('.balance')).toHaveLength(1)
        expect(wrapper.find('.incomes')).toHaveLength(1)
        expect(wrapper.find('.expenses')).toHaveLength(1)
    })

    it('should calculate the right balance, expense and incomes', () => {
        const transactions = createTransactions([30,20.50,-10]);
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(transactions)
        wrapper = shallow(<Balance/>)

        expect(wrapper.find('.balance > .amount').text()).toContain("40.5");
        expect(wrapper.find('.incomes > .amount').text()).toContain("50.5");
        expect(wrapper.find('.expenses > .amount').text()).toContain("10");
    })
})

const createTransactions = (arr) => {
    const res = [];
    for (let i=0; i < arr.length; i++){
        if(arr[i] >= 0) res.push({amount:arr[i], type:'income', id:i.toString(), title:'test', category:'salary', date:1606435200000});
        else res.push({amount:Math.abs(arr[i]), type:'expense', id:i.toString(), title:'test', category:'food', date:1606435200000})
    }
    return res
}