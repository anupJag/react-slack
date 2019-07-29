import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            };
        default:
            return state
    }
}

export default combineReducers({
    user : user_reducer
});