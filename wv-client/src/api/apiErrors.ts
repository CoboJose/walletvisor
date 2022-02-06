const translateError = (errorCode: string): string => {
  const language = 'en';
  
  switch (language) {
    case 'en':
      return englishErrors[errorCode];
    default:
      return englishErrors[errorCode];
  }
};

const englishErrors: Record<string, string> = {
  GE000: 'Unexpected error, please contact with: cobogue@gmail.com',
  GE001: 'Could not parse the request',
  GE002: 'Incorrect payload',
  GE003: 'Missing values',

  AU000: 'The given email is already in use',
  AU001: 'No account with the given email',
  AU002: 'Incorrect password',
  AU003: 'Invalid email',
  AU004: 'Invalid password, it must have at least one of each: lowercase, uppercase, special character, and more than 8 characters',
  AU005: 'No Token provided',
  AU006: 'Not a Refresh Token',
  AU007: 'This user is not allowed to access this site',
  AU008: 'The token has expired',
  AU009: 'Invalid token',
  AU010: 'Not an Access Token',

  US000: 'There is no user with that id',
  US001: 'There is no user with that email',

  TR000: 'Invalid Transaction, check that, 1:(kind=income OR kind=expense,) 2:(If kind=income then category IN ["salary", "business", "gifts", "other"]. If kind=expense then category IN ["food","home", "shopping", "transport", "bills", "entertainment", "other"]), 3:(amount and date >=0)',
  TR001: 'This user has not any transaction',
  TR002: 'There are no transactions with that id for that user',

  GR000: 'There is no group with that id',
  GR001: 'Invalid color',
  GR002: 'This user has no groups',

  GI000: 'There is no group invitation with that id',
  GI001: 'There are no group invitations for that group',
  GI002: 'This user is already invited in this group',
  GI004: 'This user already belongs in this group',

  GT000: 'There is no group transaction with that id',
  GT001: 'There are no group transactions in that group',
  GT002: 'Invalid GroupTransaction, check that, 1:(kind=income OR kind=expense,) 2:(If kind=income then category IN ["salary", "business", "gifts", "other"]. If kind=expense then category IN ["food","home", "shopping", "transport", "bills", "entertainment", "other"]), 3:(amount and date >=0)',
  GT003: 'There should be at least two users in the group to create a groupTransaction',

  EL000: 'There is no expense limit with that id',
  EL001: 'There are no expense limits for that group id',
  EL002: 'Invalid Expense Limit, check the category is correct, or all, and the amount is greater than 0',
};

export default translateError;
