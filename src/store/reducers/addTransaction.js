import * as actionTypes from '../actions/actionTypes'

const initialState = {
    balance: 0
}

const updateBalance = (state, action) => {

    const newAmount = action.typee ==='expense' ? -action.amount : action.amount
    console.log(newAmount)
    const updatedState = {
        ...state,
        balance: parseFloat((state.balance + newAmount).toFixed(2))
    }

    return updatedState;
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.UPDATE_BALANCE : return updateBalance(state, action);
        default: return state;
    }
}

export default reducer