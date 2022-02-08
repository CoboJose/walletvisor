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
    svg: SvgIcons.Food,
  },
  {
    key: TransactionCategory.Shopping,
    type: TransactionKind.Expense,
    name: 'Shopping',
    svg: SvgIcons.Shopping,
  },
  {
    key: TransactionCategory.Transport,
    type: TransactionKind.Expense,
    name: 'Transport',
    svg: SvgIcons.Transport,
  },
  {
    key: TransactionCategory.Bills,
    type: TransactionKind.Expense,
    name: 'Bills',
    svg: SvgIcons.Bills,
  },
  {
    key: TransactionCategory.Home,
    type: TransactionKind.Expense,
    name: 'Home',
    svg: SvgIcons.Home,
  },
  {
    key: TransactionCategory.Leisure,
    type: TransactionKind.Expense,
    name: 'Leisure',
    svg: SvgIcons.Leisure,
  },
  {
    key: TransactionCategory.Health,
    type: TransactionKind.Expense,
    name: 'Health',
    svg: SvgIcons.Health,
  },
  {
    key: TransactionCategory.Gifts,
    type: TransactionKind.Expense,
    name: 'Gifts',
    svg: SvgIcons.Gift,
  },
  {
    key: TransactionCategory.Education,
    type: TransactionKind.Expense,
    name: 'Education',
    svg: SvgIcons.Education,
  },
  {
    key: TransactionCategory.Groceries,
    type: TransactionKind.Expense,
    name: 'Groceries',
    svg: SvgIcons.Groceries,
  },
  {
    key: TransactionCategory.Sport,
    type: TransactionKind.Expense,
    name: 'Sport',
    svg: SvgIcons.Sport,
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Expense,
    name: 'Other',
    svg: SvgIcons.QuestionMark,
  },

  {
    key: TransactionCategory.Salary,
    type: TransactionKind.Income,
    name: 'Salary',
    svg: SvgIcons.Moneybag,
  },
  {
    key: TransactionCategory.Business,
    type: TransactionKind.Income,
    name: 'Business',
    svg: SvgIcons.Briefcase,
  },
  {
    key: TransactionCategory.Gifts,
    type: TransactionKind.Income,
    name: 'Gifts',
    svg: SvgIcons.Gift,
  },
  {
    key: TransactionCategory.Loan,
    type: TransactionKind.Income,
    name: 'Loan',
    svg: SvgIcons.Loan,
  },
  {
    key: TransactionCategory.Other,
    type: TransactionKind.Income,
    name: 'Other',
    svg: SvgIcons.QuestionMark,
  },

];

export const getTransactionCategoryData = (category: TransactionCategory): TransactionCategoryData => {
  const res = transactionCategoriesData.find((c) => c.key === category);
  const defaultCategory = transactionCategoriesData.find((c) => c.key === TransactionCategory.Other)!;
  return res !== undefined ? res : defaultCategory;
};
