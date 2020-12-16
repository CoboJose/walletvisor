import React from 'react';

import './Intro.css'
import image from '../../../assets/images/budget.png'

const Intro = (props) => {
    return (
        <div className={props.className}>
            
            <div className='title'>
                <span style={{color:'white'}}>Wallet</span><span style={{color:'var(--purple_1)'}}>Visor</span>
            </div>

            <div className='image'>
                <img src={image}/>
            </div>

            <div className='text'>
                <p><strong><span style={{color: "var(--purple_1)"}}>WalletVisor</span></strong> is an app to manage your personal finances from any of your devices.</p>
                <p>Some of its features are:</p>
                <ul>
                    <li>Save your data in the cloud, so it is accessible anywhere</li>
                    <li>Manage all your daily expenses and incomes easily.</li>
                    <li>Its a complete application that run on any browser, in computers or mobile phones.</li>
                </ul>
                <br></br>
                <p>It was made with <span style={{color: '#61DAFB'}}>React</span>, <span style={{color: '#8761c7'}}>Redux </span>and <span style={{color: '#FFCB2D'}}>Firebase</span> and totally responsive.</p>
                <br></br>
                <p>This is the result of my final degree project in Software Engineering for the University of Seville.</p>
            </div>
            
        </div>
    )
}
export default Intro;