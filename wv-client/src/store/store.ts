import { configureStore } from '@reduxjs/toolkit';

import authSlice from 'store/slices/auth';
import configSlice from 'store/slices/config';
import transactionsSlice from './slices/transactions';
import userSlice from 'store/slices/user';
import groupsSlice from 'store/slices/groups';
import groupInvitationsSlice from './slices/groupInvitations';

const store = configureStore({
  reducer: {
    auth: authSlice,
    transactions: transactionsSlice,
    config: configSlice,
    user: userSlice,
    groups: groupsSlice,
    groupInvitations: groupInvitationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
