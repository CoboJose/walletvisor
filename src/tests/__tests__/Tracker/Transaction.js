import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux';
import Transaction from '../../../components/Tracker/Transactions/Transaction/Transaction';

configure({adapter: new Adapter()});

describe('Tracker/Tracker', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        spySelector
            .mockReturnValueOnce(false);
        const transaction = {amount:10, type:'income', id:'aaBB1122', title:'test', category:'salary', date:1606435200000}
        wrapper = shallow(<Transaction t={transaction}/>);
    })

    it('should always show the amount', () => {
        expect(wrapper.find('.nodetails').text()).toContain('10')
    });

    it('should show more info when clicked, and remove it when clicked again', () => {
        expect(wrapper.find('p')).toHaveLength(0)

        wrapper.find('.nodetails').simulate('click')
        expect(wrapper.find('p')).toHaveLength(4)

        wrapper.find('.nodetails').simulate('click')
        expect(wrapper.find('p')).toHaveLength(0)
    })

    it('should show the form when update is clicked', () => {
        expect(wrapper.find('TransactionForm')).toHaveLength(0)

        wrapper.find('.nodetails').simulate('click')
        wrapper.find('button').at(0).simulate('click')

        expect(wrapper.find('TransactionForm')).toHaveLength(1)
    })
});
//console.log(wrapper.debug())