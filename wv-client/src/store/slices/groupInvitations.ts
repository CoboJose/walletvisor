import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, CreateGroupInvitationRequest, GroupInvitation, GroupInvitationResponse } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupInvitationsState {
  groupInvitations: GroupInvitationResponse[],
  userInvitations: GroupInvitationResponse[];
  isLoading: boolean,
}

const initialState: GroupInvitationsState = {
  groupInvitations: [],
  userInvitations: [],
  isLoading: false,
};

export const getGroupInvitations = createAsyncThunk<GroupInvitationResponse[], number, {state: RootState, rejectValue: ApiError }>(
  'groupInvitations/getGroupInvitations',
  async (groupId, { rejectWithValue }) => {
    try { return await api.getGroupInvitations(groupId); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const getUserInvitations = createAsyncThunk<GroupInvitationResponse[], void, {state: RootState, rejectValue: ApiError }>(
  'groupInvitations/getUserInvitations',
  async (_, { rejectWithValue }) => {
    try { return await api.getUserInvitations(); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const joinGroup = createAsyncThunk<GroupInvitationResponse[], GroupInvitationResponse, {state: RootState, rejectValue: ApiError }>(
  'groupInvitations/joinGroup',
  async (groupInvitationResponse, { rejectWithValue }) => {
    const groupInvitation: GroupInvitation = { 
      id: groupInvitationResponse.id, 
      invitedUserId: groupInvitationResponse.invitedUserId, 
      inviterUserId: groupInvitationResponse.inviterUserId, 
      groupId: groupInvitationResponse.groupId 
    };
    try { 
      await api.joinGroup(groupInvitation);
      return await api.getUserInvitations();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroupInvitation = createAsyncThunk<GroupInvitationResponse[], CreateGroupInvitationRequest, {state: RootState, rejectValue: ApiError }>(
  'groupInvitations/createGroupInvitation',
  async (groupInvitationRequest, { rejectWithValue }) => {
    try { 
      await api.createGroupInvitation(groupInvitationRequest);
      return await api.getGroupInvitations(groupInvitationRequest.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroupInvitation = createAsyncThunk<null, number, {state: RootState, rejectValue: ApiError }>(
  'groups/deleteGroupInvitation',
  async (groupInvitationId, { rejectWithValue }) => {
    try { 
      await api.deleteGroupInvitation(groupInvitationId);
      return null;
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const groupInvitationsSlice = createSlice({
  name: 'groupInvitations',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    //GET GROUP INVITATIONS
    builder.addCase(getGroupInvitations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGroupInvitations.fulfilled, (state, action) => {
      state.groupInvitations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getGroupInvitations.rejected, (state) => {
      state.isLoading = false;
    });
    //GET USER INVITATIONS
    builder.addCase(getUserInvitations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInvitations.fulfilled, (state, action) => {
      state.userInvitations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUserInvitations.rejected, (state) => {
      state.isLoading = false;
    });
    //JOIN
    builder.addCase(joinGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(joinGroup.fulfilled, (state, action) => {
      state.userInvitations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(joinGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //CREATE
    builder.addCase(createGroupInvitation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createGroupInvitation.fulfilled, (state, action) => {
      state.groupInvitations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createGroupInvitation.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteGroupInvitation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteGroupInvitation.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteGroupInvitation.rejected, (state) => {
      state.isLoading = false;
    });
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

export default groupInvitationsSlice.reducer;
