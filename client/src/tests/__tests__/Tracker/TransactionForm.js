import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux'
import helpers from '../../../utils/helpers'
import TransactionForm from '../../../components/Tracker/shared/TransactionForm'

configure({adapter: new Adapter()});

describe('Tracker/TransactionForm', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        spySelector
            .mockReturnValueOnce(false);
    })

    it('should render a form', () => {
        wrapper = shallow(<TransactionForm/>);
        
        expect(wrapper.find('form')).toHaveLength(1);
    });

    it('should change the state when an input is detected', () => {
        wrapper = shallow(<TransactionForm/>);
        
        let titleInput = wrapper.find('input').at(0);
        expect(titleInput.props().value).toBe("")
        
        titleInput.simulate('change', {target: {value:'test'}})
        titleInput = wrapper.find('input').at(0);
        expect(titleInput.props().value).toBe("test");
    });

    it('should change the default category when the type is changed', () => {
        wrapper = shallow(<TransactionForm/>);
        
        let categoryInput  = wrapper.find('select').at(0);
        const typeInput = wrapper.find('select').at(1);
        
        expect(typeInput.props().value).toBe('expense')
        expect(categoryInput.props().value).toBe('food')

        typeInput.simulate('change', {target: {value:'income'}})
        categoryInput = wrapper.find('select').at(0);
        expect(categoryInput.props().value).toBe('salary')
    });

    it('should display todays date at the begining', () => {
        wrapper = shallow(<TransactionForm/>);

        const dateInput = wrapper.find('input').at(1);
        expect(dateInput.props().value).toBe(helpers.getCurrentStringDate())
    })

    it('should display an error msg when the form is submitted and the data is not valid', () => {
        wrapper = shallow(<TransactionForm/>);

        const titleInput = wrapper.find('input').at(0);
        let categoryInput  = wrapper.find('select').at(0);
        const dateInput = wrapper.find('input').at(1);
        const amountInput = wrapper.find('input').at(2);
        const typeInput = wrapper.find('select').at(1);
        
        
        titleInput.simulate('change', {target: {value:5}});
        amountInput.simulate('change', {target: {value:-5}});
        typeInput.simulate('change', {target: {value:'noValid'}});
        categoryInput.simulate('change', {target: {value:'noValid'}});
        dateInput.simulate('change', {target: {value:'noValid'}});
        
        wrapper.find('form').simulate('submit', { preventDefault: () => null})
        
        expect(wrapper.find('.err-msg').at(0).text()).toBe('The title must be a string')
        expect(wrapper.find('.err-msg').at(1).text()).toBe('Must be a valid category')
        expect(wrapper.find('.err-msg').at(2).text()).toBe('Must be a valid Date')
        expect(wrapper.find('.err-msg').at(3).text()).toBe('It must be a positive number')
        expect(wrapper.find('.err-msg').at(4).text()).toBe('Must be expense or income')
    })

    it('should display the correct values if a transaction is passed for update', () => {
        const transaction = {amount:10, type:'income', id:'aaBB1122', title:'test', category:'salary', date:1606435200000}
        wrapper = shallow(<TransactionForm t={transaction}/>);

        expect(wrapper.find('input').at(0).props().value).toBe('test')
        expect(wrapper.find('input').at(1).props().value).toBe('2020-11-27')
        expect(wrapper.find('select').at(0).props().value).toBe('salary')
        expect(wrapper.find('select').at(1).props().value).toBe('income')
        expect(wrapper.find('input').at(2).props().value).toBe(10)
    })

})