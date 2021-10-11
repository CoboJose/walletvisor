/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransactionCategory, TransactionKind, SvgIcons } from 'types/types';

export type TransactionCategoryData = {
  key: TransactionCategory,
  type: TransactionKind,
  name: string,
  svg: SvgIcons,
}

export const transactionCategoriesData: TransactionCategoryData[] = [
  {
    key: TransactionCategory.Food,
    type: TransactionKind.Expense,
    name: 'Food & Drink',
    svg: 'food',
  },
  {
    key: TransactionCategory.Shopping,
    type: TransactionKind.Expense,
    name: 'Shopping',
    svg: 'shopping',
  },
  {
    key: TransactionCategory.Transport,
    type: TransactionKind.Expense,
    name: 'Transport',
    svg: 'transport',
  },
  {
    key: TransactionCategory.Bills,
    type: TransactionKind.Expense,
    name: 'Bills',
    svg: 'bills',
  },
  {
    key: TransactionCategory.Home,
    type: TransactionKind.Expense,
    name: 'Home',
    svg: 'home',
  },
  {
    key: TransactionCategory.Entertainment,
    type: TransactionKind.Expense,
    name: 'Entertainment',
    svg: 'entertainment',
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Expense,
    name: 'Other',
    svg: 'questionMark',
  },

  {
    key: TransactionCategory.Salary,
    type: TransactionKind.Income,
    name: 'Salary',
    svg: 'moneyBag',
  },
  {
    key: TransactionCategory.Business,
    type: TransactionKind.Income,
    name: 'Business',
    svg: 'briefCase',
  },
  {
    key: TransactionCategory.Gifts,
    type: TransactionKind.Income,
    name: 'Gifts',
    svg: 'gift',
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Income,
    name: 'Other',
    svg: 'questionMark',
  },

];

export const getTransactionCategoryData = (category: TransactionCategory): TransactionCategoryData => {
  const res = transactionCategoriesData.find((c) => c.key === category);
  const defaultCategory = transactionCategoriesData.find((c) => c.key === TransactionCategory.Other)!;
  return res !== undefined ? res : defaultCategory;
};
