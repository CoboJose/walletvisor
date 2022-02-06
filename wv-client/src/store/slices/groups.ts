import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, Group, UserGroup } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupsState {
  userGroups: UserGroup[],
  selectedGroup: UserGroup|null,
  isLoading: boolean,
}

const initialState: GroupsState = {
  userGroups: [],
  selectedGroup: null,
  isLoading: false,
};

export const getGroups = createAsyncThunk<UserGroup[], void, {state: RootState, rejectValue: ApiError }>(
  'groups/getGroups',
  async (_, { rejectWithValue }) => {
    try { return await api.getUserGroups(); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroup = createAsyncThunk<UserGroup[], Group, {state: RootState, rejectValue: ApiError }>(
  'groups/createGroup',
  async (group, { rejectWithValue }) => {
    try { 
      await api.createGroup(group);
      return await api.getUserGroups();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const updateGroup = createAsyncThunk<UserGroup[], Group, {state: RootState, rejectValue: ApiError }>(
  'groups/updateGroup',
  async (group, { rejectWithValue }) => {
    try { 
      await api.updateGroup(group);
      return await api.getUserGroups();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroup = createAsyncThunk<UserGroup[], {groupId: number}, {state: RootState, rejectValue: ApiError }>(
  'groups/deleteGroup',
  async ({ groupId }, { rejectWithValue }) => {
    try { 
      await api.deleteGroup(groupId);
      return await api.getUserGroups();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const removeUserGroup = createAsyncThunk<UserGroup[], {groupId: number, userId: number}, {state: RootState, rejectValue: ApiError }>(
  'groups/removeUserGroup',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try { 
      await api.removeUserGroup(groupId, userId);
      return await api.getUserGroups();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<UserGroup|null>) => {
      state.selectedGroup = action.payload;
    },
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getGroups.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.userGroups = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getGroups.rejected, (state) => {
      state.isLoading = false;
    });
    //CREATE
    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.userGroups = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //UPDATE
    builder.addCase(updateGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.userGroups = action.payload;
      const updatedGroup = action.payload.find((g) => g.group.id === state.selectedGroup!.group.id);
      state.selectedGroup = updatedGroup !== undefined ? updatedGroup : null;
      state.isLoading = false;
    });
    builder.addCase(updateGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.userGroups = action.payload;
      state.selectedGroup = null;
      state.isLoading = false;
    });
    builder.addCase(deleteGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //Remove User Group
    builder.addCase(removeUserGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeUserGroup.fulfilled, (state, action) => {
      state.userGroups = action.payload;
      const updatedGroup = action.payload.find((g) => g.group.id === state.selectedGroup!.group.id);
      state.selectedGroup = updatedGroup !== undefined ? updatedGroup : null;
      state.isLoading = false;
    });
    builder.addCase(removeUserGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

export const { setSelectedGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
