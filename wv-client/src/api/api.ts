import { axiosInstance as axios, axiosNoInterceptorInstance as axsNoInterceptor } from 'api/axiosInstance';
import { AuthResponse, ApiError, Transaction, GetTransactionsResponse, User, UpdateUserPayload, Group, GroupInvitationResponse, GroupInvitation, CreateGroupInvitationRequest, GroupTransaction, GroupTransactionDTO, GroupDTO } from 'types/types';

const UNEXPECTED_ERROR: ApiError = { code: 'GE000', message: 'Unexpected Error, please contact with cobogue@gmail.com', debugMessage: '' };

// Used to test the conection, and wake up the server
const ping = async (): Promise<string> => {
  const url = '/ping';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

//////////
// AUTH //
//////////

const login = async (email: string, password: string): Promise<AuthResponse> => {
  const url = '/auth/login';
  const body = { email, password };

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const register = async (email: string, password: string): Promise<AuthResponse> => {
  const url = '/auth/signup';
  const body = { email, password };

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const refreshToken = async (refreshTkn: string): Promise<AuthResponse> => {
  const url = '/auth/refreshToken';
  axsNoInterceptor.defaults.headers.common.refreshToken = refreshTkn;
  
  return new Promise((resolve, reject) => {
    axsNoInterceptor.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

//////////////////
// TRANSACTIONS //
//////////////////
const getTransactions = async (from: number, to: number): Promise<GetTransactionsResponse> => {
  const url = '/transactions';
  const params = { from, to };

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const addTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const url = '/transactions';
  const body = transaction;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const url = '/transactions';
  const body = transaction;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const deleteTransaction = async (transactionId: number): Promise<string> => {
  const url = '/transactions';
  const params = { transactionId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

//////////
// USER //
//////////
const getUser = async (): Promise<User> => {
  const url = '/user';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        const user = <User>{};
        user.id = response.data.id;
        user.email = response.data.email;
        user.name = response.data.name;
        resolve(user); 
      })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateUser = async (updateUserPayload: UpdateUserPayload): Promise<User> => {
  const url = '/user';
  const body = updateUserPayload;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => {
        const user = <User>{};
        user.id = response.data.id;
        user.email = response.data.email;
        user.name = response.data.name;
        resolve(user); 
      })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

////////////
// Groups //
////////////
const getGroupDtos = async (): Promise<GroupDTO[]> => {
  const url = '/groups';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const createGroup = async (group: Group): Promise<Group> => {
  const url = '/groups';
  const body = group;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateGroup = async (group: Group): Promise<Group> => {
  const url = '/groups';
  const body = group;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const deleteGroup = async (groupId: number): Promise<string> => {
  const url = '/groups';
  const params = { groupId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const removeUserFromGroup = async (groupId: number, userId: number): Promise<string> => {
  const url = '/groups/removeuser';
  const params = { groupId, userId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

///////////////////////
// Group Invitations //
///////////////////////
const getGroupInvitations = async (groupId: number): Promise<GroupInvitationResponse[]> => {
  const url = '/groupinvitations/group';
  const params = { groupId };

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const getUserInvitations = async (): Promise<GroupInvitationResponse[]> => {
  const url = '/groupinvitations/user';
  const params = { };

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const joinGroup = async (groupInvitation: GroupInvitation): Promise<GroupInvitation> => {
  const url = '/groupinvitations/join';
  const body = groupInvitation;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const createGroupInvitation = async (createInvitationRequest: CreateGroupInvitationRequest): Promise<GroupInvitation> => {
  const url = '/groupinvitations/create';
  const body = createInvitationRequest;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const deleteGroupInvitation = async (groupInvitationId: number): Promise<string> => {
  const url = '/groupinvitations/delete';
  const params = { groupInvitationId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

////////////////////////
// Group Transactions //
////////////////////////

const getGroupTransactions = async (groupId: number): Promise<GroupTransactionDTO[]> => {
  const url = '/grouptransactions';
  const params = { groupId };

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const createGroupTransaction = async (groupTransactionDTO: GroupTransactionDTO): Promise<GroupTransaction> => {
  const url = '/grouptransactions';
  const body = groupTransactionDTO;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateGroupTransaction = async (groupTransaction: GroupTransaction): Promise<GroupTransaction> => {
  const url = '/grouptransactions';
  const body = groupTransaction;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const payGroupTransaction = async (groupTransaction: GroupTransaction): Promise<string> => {
  const url = '/grouptransactions/pay';
  const body = groupTransaction;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const deleteGroupTransaction = async (groupTransactionId: number): Promise<string> => {
  const url = '/grouptransactions';
  const params = { groupTransactionId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

export default { 
  ping,
  login,
  register,
  refreshToken,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction, 
  getUser,
  updateUser,
  getGroupDtos,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupInvitations,
  removeGroup: removeUserFromGroup, 
  getUserInvitations,
  joinGroup,
  createGroupInvitation,
  deleteGroupInvitation,
  getGroupTransactions,
  createGroupTransaction,
  updateGroupTransaction,
  deleteGroupTransaction,
  payGroupTransaction
};
