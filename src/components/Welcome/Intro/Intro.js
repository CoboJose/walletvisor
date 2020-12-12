import React from 'react';

import styles from './Intro.module.css'
import image from '../../../assets/images/budget.png'

const Intro = (props) => {
    return (
        <div className={props.className}>
            
            <div className={styles.title}>
                <span style={{color:'white'}}>Wallet</span><span style={{color:'#9830ff'}}>Visor</span>
            </div>

            <div className={styles.image}>
                <img src={image}/>
            </div>

            <div className={styles.text}>
                <p><strong><span style={{color: "#ffffff", fontWeight: 'bold'}}>WalletVisor</span></strong> is an app to manage your personal finances from any of your devices.</p>
                <br></br>
                <p>Some of its features are:</p>
                <br></br>
                <ul>
                    <li>Save your data in the cloud, so it is accessible anywhere</li>
                    <li>Manage all your daily expenses and incomes easily.</li>
                    <li>Its a complete application that run on any browser, in computers or mobile phones.</li>
                </ul>
                <br></br>
                <p>It was made with <span className={styles.introReact}>React</span>, <span className={styles.introRedux}>Redux </span>and <span className={styles.introFirebase}>Firebase</span> and totally responsive.</p>
                <br></br>
                <p>This is the result of my final degree project in Software Engineering for the University of Seville.</p>
            </div>
            
        </div>
    )
}
export default Intro;