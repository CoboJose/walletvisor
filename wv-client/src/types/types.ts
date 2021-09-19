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
  userId: number

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
