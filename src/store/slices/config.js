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
                    document.body.style.background = '#1f1f1f'
                    localStorage.setItem('theme','dark')
                }
                else{
                    document.getElementById('root').className = 'light'
                    document.body.style.background = '#F2F4F6'
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
                    document.body.style.background = '#f0eded'
                    localStorage.setItem('theme','light')
                }
                else{
                    document.getElementById('root').className = 'dark'
                    document.body.style.background = '#1f1f1f'
                    localStorage.setItem('theme','dark')
                }
                
                return {}
            }
        }
    }
});

export const {initTheme, changeTheme} = configSlice.actions;
export default configSlice.reducer;