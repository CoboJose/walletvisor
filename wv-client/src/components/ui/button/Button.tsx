/* eslint-disable react/button-has-type */
import React from 'react';
import logger from 'utils/logger';
//import { ReactComponent as CloseSvg } from 'assets/icons/others/close.svg';
//import { ReactComponent as WarningSvg } from 'assets/icons/others/warning.svg';
import style from './Button.module.scss';

type ButtonProps = {
  text: string
  color: 'green' | 'red'
  disabled: boolean
  type: 'submit' | 'button'
}

/*const getIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <CloseSvg className={`${style.svg} ${style[type]}`} />;
    case 'warning':
      return <WarningSvg className={`${style.svg} ${style[type]}`} />;
    default:
      return null;
  }
};*/

const Button = ({ text, color, disabled, type }: ButtonProps): JSX.Element => {
  logger.rendering();

  return (
    <button type={type} className={`${style.button} ${style[color]}`} disabled={disabled}>
      { text }
    </button>
  );
};

export default Button;
