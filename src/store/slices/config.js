import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
    name: 'config',
    initialState: {
        debug:{
            renders: true,
        },
        theme: '',
    },

    reducers: {
        
        initTheme:{
            reducer: (state,action) => {
                state.theme = (action.theme == 'dark') ? 'dark' : 'light'
            },
            prepare: () => {
                let theme = localStorage.getItem('theme')
                if(theme == null) theme = 'dark'

                if(theme == 'dark'){
                    document.getElementById('root').className = 'dark'
                    document.body.style.background = 'var(--body_background_dark)'
                    localStorage.setItem('theme','dark')
                }
                else{
                    document.getElementById('root').className = 'light'
                    document.body.style.background = 'var(--body_background_light)'
                    localStorage.setItem('theme','light')
                }
                
                return {theme}
            }
        },
        
        changeTheme:{
            reducer: (state) => {
                state.theme = (state.theme == 'dark') ? 'light' : 'dark'
            },
            prepare: () => {
                let oldTheme = localStorage.getItem('theme');

                if(oldTheme == 'dark'){
                    document.getElementById('root').className = 'light'
                    document.body.style.background = 'var(--body_background_light)'
                    localStorage.setItem('theme','light')
                }
                else{
                    document.getElementById('root').className = 'dark'
                    document.body.style.background = 'var(--body_background_dark)'
                    localStorage.setItem('theme','dark')
                }
                
                return {}
            }
        }
    }
});

export const {initTheme, changeTheme} = configSlice.actions;
export default configSlice.reducer;