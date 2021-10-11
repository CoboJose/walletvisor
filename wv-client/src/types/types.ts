export type ApiError = {
  code: string,
  debugMessage: string
  message: string,
}

export type AuthResponse = {
  tokenExpiresInMinutes: number,
  refreshToken: string,
  role: string,
  token: string
}

export type Transaction = {
  id: number,
  name: string,
  kind: TransactionKind,
  category: TransactionCategory,
  amount: number,
  date: number,
  userID: number

}

export enum TransactionKind {
  Income = 'income',
  Expense = 'expense'
}

export enum TransactionCategory {
  Salary = 'salary', 
  Business = 'business', 
  Gifts = 'gifts',
  Food = 'food',
  Home = 'home', 
  Shopping = 'shopping', 
  Transport = 'transport', 
  Bills = 'bills', 
  Entertainment = 'entertainment', 
  Other = 'other'
}

export type SvgIcons = 'logo' | 'lock' | 'moneyBag' | 'briefCase' | 'gift' | 'questionMark' | 'food' | 'home' | 'shopping' | 'transport' | 'bills' | 'entertainment' | 'other' | 'edit' | 'delete' | 'add' | 'line' | 'back' | 'close';
