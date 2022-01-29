////////////
// MODELS //
////////////
export type Transaction = {
  id: number,
  name: string,
  kind: TransactionKind,
  category: TransactionCategory,
  amount: number,
  date: number,
  userID: number

}

export type User = {
  id: number,
  email: string,
  name: string,
}

/////////////////
// API HELPERS //
/////////////////
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

export type GetTransactionsResponse = {
  transactions: Transaction[],
  totalBalance: number,
}

export type UpdateUserPayload = {
  name: string,
  email: string,
  newPassword: string|null,
  oldPassword: string,
}

///////////
// OTHER //
///////////
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

export enum SvgIcons {
  Logo = 'logo', 
  Lock = 'lock',
  Moneybag = 'moneyBag',
  Briefcase = 'briefCase',
  Gift = 'gift',
  QuestionMark = 'questionMark',
  Food = 'food',
  Home = 'home',
  Shopping= 'shopping',
  Transport = 'transport', 
  Bills = 'bills', 
  Entertainment = 'entertainment', 
  Other = 'other', 
  Edit = 'edit', 
  Delete = 'delete', 
  Add = 'add', 
  Line = 'line', 
  Back = 'back', 
  Close = 'close',
  ThreeLines = 'threeLines',
  Sun = 'sun',
  Moon = 'moon',
  User = 'user',
  Chart = 'chart',
  Info = 'info',
  Exchange = 'exchange',
  Calendar = 'calendar',
  Settings = 'settings',
  Logout = 'logout',
  Filter = 'filter',
  Group = 'group',
}
