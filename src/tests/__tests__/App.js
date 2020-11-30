import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux';
import App from '../../../src/App'

configure({ adapter: new Adapter() });

describe('Tracker/AddTransaction', () => {

    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {

    })

    it('should render the auth module if not userToken is found', () => {
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null);
        wrapper = shallow(<App />);

        expect(wrapper.find('auth')).toHaveLength(1)
    });

    it('should render the tracker module and user info if an userToken is found', () => {
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce('userToken')
            .mockReturnValueOnce('userId');
        wrapper = shallow(<App />);

        expect(wrapper.find('tracker')).toHaveLength(1)
        expect(wrapper.find('p').text()).toContain('userId')
    });

})