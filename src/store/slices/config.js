import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
    name: 'config',
    initialState: {
        debug:{
            renders: true,
        },
    },

    reducers: {
        
    },
});

export default configSlice.reducer;