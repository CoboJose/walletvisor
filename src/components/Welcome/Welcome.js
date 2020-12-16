import React from 'react'

import './Welcome.css'
import Intro from './Intro/Intro'
import Auth from './Auth/Auth'
import Contact from './Contact/Contact'

const Welcome = () => {
    return(
        <div className='welcome'>
            <Intro className='intro'/>
            <Auth className='auth'/>
            <Contact className='contact'/>
        </div>
    )
}
export default Welcome