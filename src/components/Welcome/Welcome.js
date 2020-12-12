import React from 'react'

import styles from './Welcome.module.css'
import Intro from './Intro/Intro'
import Auth from './Auth/Auth'
import Contact from './Contact/Contact'

const Welcome = () => {
    return(
        <div className={styles.welcome}>
            <Intro className={styles.intro}/>
            <Auth className={styles.auth}/>
            <Contact className={styles.contact}/>
        </div>
    )
}
export default Welcome