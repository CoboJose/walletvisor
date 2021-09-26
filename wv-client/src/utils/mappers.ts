import { TransactionCategory, SvgIcons } from 'types/types';

const transactionLogos = (category: TransactionCategory): SvgIcons => {
  switch (category) {
    case (TransactionCategory.Salary):
      return 'moneyBag';

    case (TransactionCategory.Business):
      return 'briefCase';

    case (TransactionCategory.Gifts):
      return 'gift';

    case (TransactionCategory.Food):
      return 'food';

    case (TransactionCategory.Home):                 
      return 'home';

    case (TransactionCategory.Shopping):
      return 'shopping';

    case (TransactionCategory.Transport):
      return 'transport';

    case (TransactionCategory.Bills):
      return 'bills';

    case (TransactionCategory.Entertainment):
      return 'entertainment';

    case (TransactionCategory.Other):
      return 'questionMark';

    default:
      return 'logo';
  }
};

export default { transactionLogos };
