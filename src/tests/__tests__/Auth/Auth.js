import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as redux from 'react-redux'
import Auth from '../../../components/Welcome/Auth/Auth'

configure({adapter: new Adapter()});

describe('Auth/Auth', () => {
    
    let wrapper;
    const spySelector = jest.spyOn(redux, 'useSelector')
    jest.spyOn(redux, 'useDispatch')

    beforeEach(() => {
        spySelector
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false)
            .mockReturnValueOnce('');

        wrapper = shallow(<Auth/>);
    })

    it('should render a form always', () => {
        expect(wrapper.find('form')).toHaveLength(1);
    });

    it('should switch to signUp when the button is clicked and back', () => {
        expect(wrapper.find('.buttonAndSpinner > button').text()).toBe('Log In');

        wrapper.find('.switch > button').simulate('click');
        expect(wrapper.find('.buttonAndSpinner > button').text()).toBe('Sign Up');

        wrapper.find('.switch > button').simulate('click');
        expect(wrapper.find('.buttonAndSpinner > button').text()).toBe('Log In');
    });

    it('should change the state when an input is detected', () => {
        let emailInput = wrapper.find('input').at(0);
        expect(emailInput.props().value).toBe("user1@test.com")
        
        emailInput.simulate('change', {target: {value:'test@test.com'}})
        emailInput = wrapper.find('input').at(0);
        expect(emailInput.props().value).toBe("test@test.com");
    });

    it('should display an error msg when the form is submitted and the data is not valid', () => {
        const emailInput = wrapper.find('input').at(0);
        const passwordInput = wrapper.find('input').at(1);

        emailInput.simulate('change', {target: {value:'test'}})
        passwordInput.simulate('change', {target: {value:'test'}})
        
        wrapper.find('form').simulate('submit', { preventDefault: () => null})
        
        expect(wrapper.find('.errormsg').at(0).text()).toBe('The email must follow this pattern: example@domain.com')
        expect(wrapper.find('.errormsg').at(1).text()).toBe('The passsword must be at least 6 character long')
    })
})