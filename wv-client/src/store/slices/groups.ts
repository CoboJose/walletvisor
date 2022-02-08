import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, Group, GroupDTO } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupsState {
  groupDtos: GroupDTO[],
  selectedGroupDto: GroupDTO|null,
  isLoading: boolean,
}

const initialState: GroupsState = {
  groupDtos: [],
  selectedGroupDto: null,
  isLoading: false,
};

export const getGroups = createAsyncThunk<GroupDTO[], void, {state: RootState, rejectValue: ApiError }>(
  'groups/getGroups',
  async (_, { rejectWithValue }) => {
    try { return await api.getGroupDtos(); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroup = createAsyncThunk<GroupDTO[], Group, {state: RootState, rejectValue: ApiError }>(
  'groups/createGroup',
  async (group, { rejectWithValue }) => {
    try { 
      await api.createGroup(group);
      return await api.getGroupDtos();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const updateGroup = createAsyncThunk<GroupDTO[], Group, {state: RootState, rejectValue: ApiError }>(
  'groups/updateGroup',
  async (group, { rejectWithValue }) => {
    try { 
      await api.updateGroup(group);
      return await api.getGroupDtos();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroup = createAsyncThunk<GroupDTO[], {groupId: number}, {state: RootState, rejectValue: ApiError }>(
  'groups/deleteGroup',
  async ({ groupId }, { rejectWithValue }) => {
    try { 
      await api.deleteGroup(groupId);
      return await api.getGroupDtos();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const removeFromGroup = createAsyncThunk<GroupDTO[], {groupId: number, userId: number}, {state: RootState, rejectValue: ApiError }>(
  'groups/removeGroup',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try { 
      await api.removeGroup(groupId, userId);
      return await api.getGroupDtos();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<GroupDTO|null>) => {
      state.selectedGroupDto = action.payload;
    },
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getGroups.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.groupDtos = action.payload;
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
      state.groupDtos = action.payload;
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
      state.groupDtos = action.payload;
      const updatedGroup = action.payload.find((g) => g.group.id === state.selectedGroupDto!.group.id);
      state.selectedGroupDto = updatedGroup !== undefined ? updatedGroup : null;
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
      state.groupDtos = action.payload;
      state.selectedGroupDto = null;
      state.isLoading = false;
    });
    builder.addCase(deleteGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //Remove User Group
    builder.addCase(removeFromGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeFromGroup.fulfilled, (state, action) => {
      state.groupDtos = action.payload;
      const updatedGroup = action.payload.find((g) => g.group.id === state.selectedGroupDto!.group.id);
      state.selectedGroupDto = updatedGroup !== undefined ? updatedGroup : null;
      state.isLoading = false;
    });
    builder.addCase(removeFromGroup.rejected, (state) => {
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
