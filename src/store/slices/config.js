import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
    name: 'config',
    initialState: {
        debug:{
            renders: false,
        },
    },

    reducers: {
        
    },
});

export default configSlice.reducer;