import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux';
import Tracker from '../../../components/Tracker/Tracker';

configure({adapter: new Adapter()});

describe('Tracker/Trackerr', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        spySelector
            .mockReturnValueOnce(false);

        wrapper = shallow(<Tracker/>);
    })

    it('should render the required components', () => {
        expect(wrapper.find('Balance')).toHaveLength(1);
        expect(wrapper.find('AddTransaction')).toHaveLength(1);
        expect(wrapper.find('Transactions')).toHaveLength(1);
    });
});