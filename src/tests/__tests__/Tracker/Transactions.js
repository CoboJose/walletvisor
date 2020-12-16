import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux';
import Transactions from '../../../components/Tracker/Transactions/Transactions';

configure({adapter: new Adapter()});

describe('Tracker/Transactions', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        
    })

    it('should not render any transaction when none is given', () => {
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce([]);

        wrapper = shallow(<Transactions/>);

        expect(wrapper.find('Transaction')).toHaveLength(0)
    });

    it('should render transactions when given', () => {
        const transactions = createTransactions([30,20.50,-10])
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(transactions);

        wrapper = shallow(<Transactions/>);

        expect(wrapper.find('Transaction')).toHaveLength(3)
        expect(wrapper.find('Transaction').at(1).props().t.amount).toBe(20.50)
    });
});

const createTransactions = (arr) => {
    const res = [];
    for (let i=0; i < arr.length; i++){
        if(arr[i] >= 0) res.push({amount:arr[i], type:'income', id:i.toString(), title:'test', category:'salary', date:1606435200000});
        else res.push({amount:Math.abs(arr[i]), type:'expense', id:i.toString(), title:'test', category:'food', date:1606435200000})
    }
    return res
}