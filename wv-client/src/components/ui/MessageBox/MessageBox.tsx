import React from 'react';
import logger from 'utils/logger';
import { ReactComponent as CloseSvg } from 'assets/icons/others/close.svg';
import { ReactComponent as WarningSvg } from 'assets/icons/others/warning.svg';
import style from './MessageBox.module.scss';

type MessageBoxProps = {
  type: 'error' | 'warning'
  message: string
}

const getIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <CloseSvg className={`${style.svg} ${style[type]}`} />;
    case 'warning':
      return <WarningSvg className={`${style.svg} ${style[type]}`} />;
    default:
      return null;
  }
};

const MessageBox = ({ type, message }: MessageBoxProps): JSX.Element => {
  logger.rendering();

  return (
    <div className={`${style.messageBox} ${style[type]}`}>
      <div className={`${style.iconBox} ${style[type]}`}>
        {getIcon(type)}
      </div>
      
      <div className={`${style.textBox} ${style[type]}`}>
        { message }
      </div>
    </div>
  );
};

export default MessageBox;
