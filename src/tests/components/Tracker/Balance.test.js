import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Balance from '../../../components/Tracker/Balance/Balance';

import * as redux from 'react-redux'



configure({adapter: new Adapter()});


describe('Tracker/Balance', () => {
    let wrapper;

    beforeEach(() => {
        const spy = jest.spyOn(redux, 'useSelector')
        spy.mockReturnValue([])
        wrapper = shallow(<Balance/>)
    })

    it('should render 3 <p> always', () => {
        expect(wrapper.find('p')).toHaveLength(3)
    })
})
