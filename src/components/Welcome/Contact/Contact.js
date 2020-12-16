import React from 'react';

import './Contact.css'
import emailIcon  from '../../../assets/icons/email.png'
import linkedinIcon  from '../../../assets/icons/linkedin.png'
import githubIcon  from '../../../assets/icons/github.png'

const Contact = (props) => {
    return (
        <div className={props.className}>
            
            <div className='title'>Contact Me</div>
            
            <div className='name'>Jose Manuel Cobo Guerrero</div>
            
            <div className='links'>
                <a href='mailto:cobogue@gmail.com' target='_blank' rel='noreferrer'><img src={emailIcon}/></a>
                <a href='https://www.linkedin.com/in/jose-cobo/' target='_blank' rel='noreferrer'><img src={linkedinIcon}/></a>
                <a href='https://github.com/CoboJose' target='_blank' rel='noreferrer'><img src={githubIcon}/></a>
            </div>
            
            <div className='source'>
                <a href='https://github.com/CoboJose/walletvisor' target='_blank' rel='noreferrer'><button>Source Code</button></a>
            </div>

        </div>
    )
}
export default Contact;