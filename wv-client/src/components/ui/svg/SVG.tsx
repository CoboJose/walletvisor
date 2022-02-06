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
import { ReactComponent as Settings } from 'assets/icons/settings.svg';
import { ReactComponent as Logout } from 'assets/icons/logout.svg';
import { ReactComponent as Filter } from 'assets/icons/filter.svg';
import { ReactComponent as Group } from 'assets/icons/group.svg';
import { ReactComponent as Ok } from 'assets/icons/ok.svg';

type SVGProps = {
  name: SvgIcons,
  className?: string,
  style?: CSSProperties | undefined,
}

const SVG = ({ name, className, style }: SVGProps): JSX.Element => {
  const returnedSVG = () => {
    switch (name) {
      case SvgIcons.Logo:
        return <Logo className={className} style={style} />;

      case SvgIcons.Lock:
        return <Lock className={className} style={style} />;
      
      case SvgIcons.Moneybag:
        return <MoneyBag className={className} style={style} />;

      case SvgIcons.Briefcase:
        return <BriefCase className={className} style={style} />;
      
      case SvgIcons.Gift:
        return <Gift className={className} style={style} />;

      case SvgIcons.QuestionMark:
        return <QuestionMark className={className} style={style} />;

      case SvgIcons.Food:
        return <FoodAndDrink className={className} style={style} />; 

      case SvgIcons.Home:
        return <Home className={className} style={style} />;

      case SvgIcons.Shopping:
        return <Shopping className={className} style={style} />;

      case SvgIcons.Transport:
        return <Transport className={className} style={style} />;

      case SvgIcons.Bills:
        return <Bills className={className} style={style} />;

      case SvgIcons.Entertainment:
        return <Entertainment className={className} style={style} />;

      case SvgIcons.Edit:
        return <Edit className={className} style={style} />;

      case SvgIcons.Delete:
        return <Delete className={className} style={style} />;

      case SvgIcons.Add:
        return <Add className={className} style={style} />;

      case SvgIcons.Line:
        return <Line className={className} style={style} />;

      case SvgIcons.Back:
        return <Back className={className} style={style} />;

      case SvgIcons.Close:
        return <Close className={className} style={style} />;

      case SvgIcons.ThreeLines:
        return <ThreeLines className={className} style={style} />;

      case SvgIcons.Sun:
        return <Sun className={className} style={style} />;  

      case SvgIcons.Moon:
        return <Moon className={className} style={style} />;  

      case SvgIcons.User:
        return <User className={className} style={style} />;  

      case SvgIcons.Chart:
        return <Chart className={className} style={style} />;  

      case SvgIcons.Info:
        return <Info className={className} style={style} />;  

      case SvgIcons.Exchange:
        return <Exchange className={className} style={style} />; 
        
      case SvgIcons.Calendar:
        return <Calendar className={className} style={style} />; 

      case SvgIcons.Settings:
        return <Settings className={className} style={style} />; 

      case SvgIcons.Logout:
        return <Logout className={className} style={style} />; 

      case SvgIcons.Filter:
        return <Filter className={className} style={style} />; 

      case SvgIcons.Group:
        return <Group className={className} style={style} />; 

      case SvgIcons.Ok:
        return <Ok className={className} style={style} />; 
      
      default:
        return <Logo className={className} style={style} />;
    }
  };

  return returnedSVG();
};

export default SVG;
