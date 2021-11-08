/* eslint-disable quote-props */
import React, { CSSProperties } from 'react';
import { SvgIcons } from 'types/types';

import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import { ReactComponent as Lock } from 'assets/icons/lock.svg';
import { ReactComponent as MoneyBag } from 'assets/icons/money_bag.svg';
import { ReactComponent as BriefCase } from 'assets/icons/brief_case.svg';
import { ReactComponent as Gift } from 'assets/icons/gift.svg';
import { ReactComponent as QuestionMark } from 'assets/icons/question_mark.svg';
import { ReactComponent as FoodAndDrink } from 'assets/icons/food_and_drink.svg';
import { ReactComponent as Shopping } from 'assets/icons/shopping_bag.svg';
import { ReactComponent as Home } from 'assets/icons/home.svg';
import { ReactComponent as Transport } from 'assets/icons/train.svg';
import { ReactComponent as Bills } from 'assets/icons/invoice.svg';
import { ReactComponent as Entertainment } from 'assets/icons/popcorn.svg';
import { ReactComponent as Edit } from 'assets/icons/edit.svg';
import { ReactComponent as Delete } from 'assets/icons/trash.svg';
import { ReactComponent as Add } from 'assets/icons/add.svg';
import { ReactComponent as Line } from 'assets/icons/line.svg';
import { ReactComponent as Back } from 'assets/icons/back.svg';
import { ReactComponent as Close } from 'assets/icons/close.svg';
import { ReactComponent as ThreeLines } from 'assets/icons/three_lines.svg';
import { ReactComponent as Sun } from 'assets/icons/sun.svg';
import { ReactComponent as Moon } from 'assets/icons/moon.svg';
import { ReactComponent as User } from 'assets/icons/user.svg';
import { ReactComponent as Chart } from 'assets/icons/chart.svg';
import { ReactComponent as Info } from 'assets/icons/info.svg';
import { ReactComponent as Exchange } from 'assets/icons/exchange.svg';
import { ReactComponent as Calendar } from 'assets/icons/calendar.svg';

type SVGProps = {
  name: SvgIcons,
  className: string,
  style?: CSSProperties | undefined,
}

const SVG = ({ name, className, style }: SVGProps): JSX.Element => {
  const returnedSVG = () => {
    switch (name) {
      case 'logo':
        return <Logo className={className} style={style} />;

      case 'lock':
        return <Lock className={className} style={style} />;
      
      case 'moneyBag':
        return <MoneyBag className={className} style={style} />;

      case 'briefCase':
        return <BriefCase className={className} style={style} />;
      
      case 'gift':
        return <Gift className={className} style={style} />;

      case 'questionMark':
        return <QuestionMark className={className} style={style} />;

      case 'food':
        return <FoodAndDrink className={className} style={style} />; 

      case 'home':
        return <Home className={className} style={style} />;

      case 'shopping':
        return <Shopping className={className} style={style} />;

      case 'transport':
        return <Transport className={className} style={style} />;

      case 'bills':
        return <Bills className={className} style={style} />;

      case 'entertainment':
        return <Entertainment className={className} style={style} />;

      case 'edit':
        return <Edit className={className} style={style} />;

      case 'delete':
        return <Delete className={className} style={style} />;

      case 'add':
        return <Add className={className} style={style} />;

      case 'line':
        return <Line className={className} style={style} />;

      case 'back':
        return <Back className={className} style={style} />;

      case 'close':
        return <Close className={className} style={style} />;

      case 'threeLines':
        return <ThreeLines className={className} style={style} />;

      case 'sun':
        return <Sun className={className} style={style} />;  

      case 'moon':
        return <Moon className={className} style={style} />;  

      case 'user':
        return <User className={className} style={style} />;  

      case 'chart':
        return <Chart className={className} style={style} />;  

      case 'info':
        return <Info className={className} style={style} />;  

      case 'exchange':
        return <Exchange className={className} style={style} />; 
        
      case 'calendar':
        return <Calendar className={className} style={style} />; 
      
      default:
        return <Logo className={className} style={style} />;
    }
  };

  return returnedSVG();
};

export default SVG;
