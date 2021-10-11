/* eslint-disable quote-props */
import React from 'react';
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

type SVGProps = {
  name: SvgIcons,
  className: string,
}

const SVG = ({ name, className }: SVGProps): JSX.Element => {
  const returnedSVG = () => {
    switch (name) {
      case 'logo':
        return <Logo className={className} />;

      case 'lock':
        return <Lock className={className} />;
      
      case 'moneyBag':
        return <MoneyBag className={className} />;

      case 'briefCase':
        return <BriefCase className={className} />;
      
      case 'gift':
        return <Gift className={className} />;

      case 'questionMark':
        return <QuestionMark className={className} />;

      case 'food':
        return <FoodAndDrink className={className} />; 

      case 'home':
        return <Home className={className} />;

      case 'shopping':
        return <Shopping className={className} />;

      case 'transport':
        return <Transport className={className} />;

      case 'bills':
        return <Bills className={className} />;

      case 'entertainment':
        return <Entertainment className={className} />;

      case 'edit':
        return <Edit className={className} />;

      case 'delete':
        return <Delete className={className} />;

      case 'add':
        return <Add className={className} />;

      case 'line':
        return <Line className={className} />;

      case 'back':
        return <Back className={className} />;

      case 'close':
        return <Close className={className} />;
        
      default:
        return <Logo className={className} />;
    }
  };

  return returnedSVG();
};

export default SVG;
