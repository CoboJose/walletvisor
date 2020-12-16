import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux'
import AddTransaction from '../../../components/Tracker/AddTransaction/AddTransaction'

configure({adapter: new Adapter()});

describe('Tracker/AddTransaction', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        spySelector
            .mockReturnValueOnce(false);

        wrapper = shallow(<AddTransaction/>);
    })

    it('should render the TransactionForm', () => {
        expect(wrapper.find('TransactionForm')).toHaveLength(1);
    });

})