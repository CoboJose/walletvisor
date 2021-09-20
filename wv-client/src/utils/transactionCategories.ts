import { TransactionCategory, TransactionKind } from 'types/types';

const categories = [
  {
    key: TransactionCategory.Food,
    type: TransactionKind.Expense,
    name: 'Food & Drink',
    icon: '🥡',
  },
  {
    key: TransactionCategory.Shopping,
    type: TransactionKind.Expense,
    name: 'Shopping',
    icon: '🛍️',
  },
  {
    key: TransactionCategory.Transport,
    type: TransactionKind.Expense,
    name: 'Transport',
    icon: '🚊',
  },
  {
    key: TransactionCategory.Bills,
    type: TransactionKind.Expense,
    name: 'Bills',
    icon: '🧾',
  },
  {
    key: TransactionCategory.Home,
    type: TransactionKind.Expense,
    name: 'Home',
    icon: '🏠',
  },
  {
    key: TransactionCategory.Entertainment,
    type: TransactionKind.Expense,
    name: 'Entertainment',
    icon: '🎮',
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Expense,
    name: 'Other',
    icon: '❓',
  },

  {
    key: TransactionCategory.Salary,
    type: TransactionKind.Income,
    name: 'Salary',
    icon: '💵',
  },
  {
    key: TransactionCategory.Business,
    type: TransactionKind.Income,
    name: 'Business',
    icon: '💼',
  },
  {
    key: TransactionCategory.Gifts,
    type: TransactionKind.Income,
    name: 'Gifts',
    icon: '🎁',
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Income,
    name: 'Other',
    icon: '❓',
  },

];

export default categories;
