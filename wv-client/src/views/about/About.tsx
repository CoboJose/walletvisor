import { Link } from '@mui/material';
import React from 'react';
import logger from 'utils/logger';

import style from './About.module.scss';

const About: React.FC = () => {
  logger.rendering();

  /////////
  // JSX //
  /////////
  return (
    <div className={style.about}>

      <div className={style.appInfo}>
        <span className={style.appName}>WalletVisor</span> is an app to manage your personal finances, 
        keeping track of them, showing insightful statistics, and allowing to share expenses with a group. <br />
        It can be accessed anywhere with any device, keeping your data in the cloud, so it is always accessible.
      </div>

      <div className={style.technologiesUsed}>
        The <span className={style.title}>technologies</span> that make it possible are:

        <ul>
          <li><span className={style.listTitle}>Front End:</span> <span className={style.react}>React</span> (Typescript, React-Router, Redux, Material UI,Recharts)</li>
          <li><span className={style.listTitle}>Back End:</span> <span className={style.go}>Go</span>, <span className={style.postgres}>PostgreSQL</span> (Echo Framework, Sqlx)</li>
          <li><span className={style.listTitle}>Continuous Integration:</span>
            <ul>
              <li><span className={style.githubActions}>GitHub Actions</span> (automatic building, testing, and deployment)</li>
              <li><span className={style.netlify}>Netlify</span> (Front Deployment)</li>
              <li><span className={style.heroku}>Heroku</span> (Back Deployment)</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className={style.personal}>
        This is the result of my final degree project in Software Engineering at the University of Seville. My name is Jose Cobo, please, check the code on Github, or contact me at any moment.
        <ul>
          <li><Link href="https://github.com/CoboJose/walletvisor" underline="hover"> GitHub </Link></li>
          <li><Link href="https://www.linkedin.com/in/jose-cobo/" underline="hover"> LinkedIn </Link></li>
          <li><Link href="mailto: cobogue@gmail.com" underline="hover"> Email Me </Link></li>
        </ul>
      </div>
            
    </div>
  );
};

export default About;
